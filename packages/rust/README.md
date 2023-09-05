# @abbudao/nx-rust

A Nx plugin that adds support for Cargo and Rust in your Nx workspace.

## Getting Started

### Prerequisites 
The following tools need to be installed on your system to take full advantage of `@abbudao/nx-rust`
* Node (LTS)
* Rust / Cargo via [https://rustup.rs](https://rustup.rs)

### Install with `npx create-nx-workspace` preset
To bootstrap a new workspace with `@abbudao/nx-rust` installed and ready, run:

```shell
npx create-nx-workspace --preset=@abbudao/nx-rust
```

### Installation in already set up workspace
Use your favourite package manager to install in your project:

```shell
yarn add -D @abbudao/nx-rust
```

```shell
npm install -D @abbudao/nx-rust
```

```shell
pnpm add -D @abbudao/nx-rust
```

#### Initialization 

After installing, you can run any of the project generators (binary, library) to have @abbudao/nx-rust set up Cargo in your workspace.

## Generators
Use Nx Console to see the full list of options for each generator. 

### `@abbudao/nx-rust:binary`
Creates a Rust binary application to be run independently.

> Create a new binary:
> ```shell
> nx generate @abbudao/nx-rust:binary my-rust-app 
> ```

### `@abbudao/nx-rust:library`
Creates a Rust library that can be used in binaries, or compiled to be used for napi. 

> Create a new library:
> ```shell
> nx generate @abbudao/nx-rust:library my-rust-lib
> ```

> Create a new library with napi:
> ```shell
> nx generate @abbudao/nx-rust:library my-rust-node-lib --napi
> ```

#### Napi
Generating a library with the `--napi` flag will set up the project to be built with it.

## Executors
All the executors support these additional properties:
* toolchain: (e.g. `--toolchain='stable' | 'beta' | 'nightly'`); 
  * Uses `stable` by default
* target (e.g. `--target=aarch64-apple-darwin`); 
* profile (e.g. `--profile=dev`) 
  * [Cargo profiles](https://doc.rust-lang.org/cargo/reference/profiles.html)
* release
* target-dir 
* features (e.g. `--features=bmp`)
  * [Cargo features](https://doc.rust-lang.org/cargo/reference/features.html)
* all-features

### `@abbudao/nx-rust:build`
Runs cargo to build the project
> Not supported with napi

### `@abbudao/nx-rust:lint`
Runs cargo clippy to link the project

### `@abbudao/nx-rust:napi`
Runs the napi cli to build the project

### `@abbudao/nx-rust:run`
Runs `cargo run` for the project
> Not supported with napi
 
### `@abbudao/nx-rust:test`
Runs `cargo test` for the project

