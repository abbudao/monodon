import { NxPluginV2 } from '@nx/devkit';
import { createNodes, createDependencies } from './graph';

const nxPlugin: NxPluginV2 = {
  name: '@abbudao/nx-rust',
  createNodes: ['Cargo.toml', createNodes],
  createDependencies,
};

export = nxPlugin;
