import {
  CreateDependencies,
  CreateNodesFunction,
  ProjectConfiguration,
  ProjectGraphDependencyWithFile,
  workspaceRoot,
} from '@nx/devkit';
import { Package } from './models/cargo-metadata';
import { cargoMetadata } from './utils/cargo';
import {
  DependencyType,
  ProjectGraphExternalNode,
} from 'nx/src/config/project-graph';

export const createNodes: CreateNodesFunction = () => {
  const projects: Record<string, ProjectConfiguration> = {};
  const externalNodes: Record<string, ProjectGraphExternalNode> = {};

  const metadata = cargoMetadata();
  if (metadata) {
    const { packages: cargoPackages } = metadata;

    const cargoPackageMap = cargoPackages.reduce((acc, p) => {
      if (!acc.has(p.name)) {
        acc.set(p.name, p);
      }
      return acc;
    }, new Map<string, Package>());

    for (const pkg of cargoPackages) {
      for (const dep of pkg.dependencies) {
        const externalDepName = `cargo:${dep.name}`;
        externalNodes[externalDepName] = {
          name: externalDepName as any,
          type: 'cargo' as any,
          data: {
            packageName: dep.name,
            version: cargoPackageMap.get(dep.name)?.version ?? '0.0.0',
          },
        };
      }
    }
  }

  return { projects, externalNodes };
};

export const createDependencies: CreateDependencies = (context) => {
  const deps: ProjectGraphDependencyWithFile[] = [];

  const metadata = cargoMetadata();
  if (metadata) {
    const { packages: cargoPackages } = metadata;

    for (const pkg of cargoPackages) {
      const path = pkg.manifest_path.replace(/\\/g, '/');
      const workspaceRootClean = workspaceRoot.replace(/\\/g, '/');
      const sourceFile = path.replace(`${workspaceRootClean}/`, '');

      if (context.graph.nodes[pkg.name]) {
        for (const dep of pkg.dependencies) {
          // if the dependency is listed in nx projects, it's not an external dependency
          const target = context.graph.nodes[dep.name]
            ? dep.name
            : `cargo:${dep.name}`;
          deps.push({
            dependencyType: DependencyType.static,
            source: pkg.name,
            target,
            sourceFile,
          });
        }
      }
    }
  }

  return deps;
};
