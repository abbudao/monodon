import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { addToCargoWorkspace } from '../../utils/add-to-workspace';
import snake_case from '../../utils/snake_case';
import init from '../init/generator';
import { RustLibraryGeneratorSchema } from './schema';

interface NormalizedSchema extends RustLibraryGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: RustLibraryGeneratorSchema
): NormalizedSchema {
  const name = snake_case(options.name);
  const projectDirectory = options.directory
    ? `${snake_case(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  // rust specifics
  options.edition ??= '2021';

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function libraryGenerator(
  tree: Tree,
  options: RustLibraryGeneratorSchema
) {
  await init(tree);
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@monodon/rust:build',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  addToCargoWorkspace(tree, normalizedOptions.projectRoot);
  await formatFiles(tree);
}
