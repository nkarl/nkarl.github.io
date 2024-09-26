---
title: Nix Flakes
description: I documented a few things I learned about Nix and Nix flakes.
pubDate: Sep 26 2024
---

I recently encountered a problem while trying to build a Docker image for a project.

The image has a few large git dependencies which flooded the bandwidth of my home network, resulted in [an RPC error on cloning](https://stackoverflow.com/questions/38618885/error-rpc-failed-curl-transfer-closed-with-outstanding-read-data-remaining/79004075#79004075). It was a kind of hair-pulling frustration, because each time it takes so long to rebuild only for it to fail half way through. I definitely [screamed](https://youtube.com/shorts/ay_F-Y7mERk?si=B-65td2XWraizXHn) a few times.

I reorganized the Dockerfile and moved the fragile dependencies toward the end. This addressed the build time problem somewhat. At this point however, I got fatigued with Docker, so I looked into other ways to manage dependencies. I revisited Nix, spending about a week time on reading and poking at it repeatedly.
 
I think Nix is a fascinating and deeply useful tool, so I want to use this article to document a few things I have learned about it.

### where to start

> - Nix, as a programming language, is purely functional
> - Nix, as a programming memory model, operates on the file system
> - Nix, as an ecosystem, has *Flake* as the most recent major feature
>     - similar to `package.json` or `stack.yaml` or `cabal.project`.
>     - with *flakes*, we can control system builds as programs.

In order to get the ball rolling with Nix as quickly as possible, I recommend that you 
- ignore **NixOS** completely.
- install **Nix** on your system; either *multi-user* or *single-user* works.
    - I am the only user of my system so I picked single-user.
- start with **Nix Flake**.

### exposition on Nix

As *a tool for managing and building system dependencies*, Nix offers environment isolation, caching and deterministic reproducibility.

When you install Nix as recommended, you install a handler into your user space that can parse and evaluate `*.nix` files via various Nix commands. This handler can create an isolated shell with all required environment variables, and then retrieve dependencies already indexed in a remote repository.

First, this solves the problem of dependency management. Second, the required dependencies are then built and cached on the local host, making build time much shorter in subsequent rebuilds. Third, all dependencies are indexed and stored by their cryptographic hashes. This means that the same exact build can be replicated with 100% certainty (referential transparency for the functional programmers). This is signficant.

### on ~~NixOS~~

The reason you should ignore NixOS is an economic one.

Most developers are gerrymandered into 3 territories: Windows, MacOS and an opague blob of Unix distros. This is a just a fact of life. It is then a logical next step to infer that most developers would prefer to stick with the systems they are familiar with. We all feel more comfortable with the tools that we own.

The costs of migrating to a new OS is simply too high for most people, especially without a proper plan.

For that reason, I suggest a *project-leveled isolation* as a more sensible approach. More below.

### on Nix flakes

At the time of this article, *Flake* is still an *experimental feature* in the Nix ecosystem.

However, it [makes so much sense](https://grahamc.com/blog/flakes-are-an-obviously-good-thing/) that it gained a [sudden growth spurt](https://www.tweag.io/blog/2022-08-04-tweag-and-nix-future/). It is even deeply integrated into the development and deployment of some major infrastructure. An example is [the Cardano blockchain node](https://github.com/IntersectMBO/cardano-node/blob/master/flake.nix). 

From a developer's standpoint, you can think of a flake as being similar to `package.json` or `pom.xml`. Be mindful that this is not a one-to-one mapping, because Nix flakes are much more powerful than JSON or XML files. It is indeed helpful, however, to prepare some ground to stand on first.

### on Nix flakes as turbo manifests

The major differences of a `flake.nix` over other manifest types is actually the programming language model (Nix) that encapsulates and operates on these flakes. 

In many popular frameworks such as Maven and Node.js, these manifests are typically *package manifests*. They specify a set of metadata including dependencies, and at best a few scripts for building and deploying the application.

```json
{
    ...
    "scripts": {
        "build": "spago build",
        "test": "spago test",
        ...
    },
    "dependencies": {
        ...
    }
}
```

From a host environment's standpoint, they still source from the context of the host's user space. That is, they depend on a preconfigure step that prepares a shell with all system-leveled dependencies. This is often done inside a container such as Docker through a pair of `Dockerfile` and `docker-compose.yaml` manifest files. It is a separate layer for security reasons that are beyond the scope of this article.

A Nix flake is a type of manifest designed for this step, but on steroid.

In a flake, you specify the sets of *inputs* and *outputs* to source and build your system dependencies. In the `inputs` attribute, you define where to source your packages. In the `outputs` attribute, you can define various actions to create an isolated environment *on top of* the list of dependency packages. Because of Nix's purely functional nature, you can look at every Nix file as a [mathematical object](https://ncatlab.org/nlab/show/object) (a high-ordered function) that accepts some arguments and produces some result that can be passed on to other mathematical objects (Nix files). The functional programmers will definitely feel at home here.

You can use a flake to set up an isolated instance from within the host's user space. This instance, instantiated from a *derivation*, has its own environment path and variables. It is hashed and stored, allowing for a set of actions that is deterministic and reproducible on other systems.

### from zero to one Nix flake

The best way to understand something is to use it. I recommend starting with a simple flake structure and use it repeatedly until you are ready to modify it. Let's try to make one ourselves.

Every flake is a [hash set](https://nix.dev/tutorials/nix-language.html#attrset) with two attributes `inputs` and `outputs`, each in turn is another attribute set. As a side note, this is an example of [recursive data type](https://en.wikipedia.org/wiki/Recursive_data_type). In the `inputs` attribute set you can define a pointer to a package indexer to source your project's dependencies from, most commonly `github:nixos/nixpkgs/nixos-*`. These indexers are versioned and managed by the Nix community:

- `github:nixos/nixpkgs/nixos-unstable` is the latest
- `github:nixos/nixpkgs/nixos-24.05` (same tip as `unstable` at the time of writing)
- `github:nixos/nixpkgs/nixos-23.11`
- `github:nixos/nixpkgs/nixos-23.05`
- ...

You can browse all indexer versions [here](https://lazamar.co.uk/nix-versions/).

Now, let's start writing a flake.

```nix
{
    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05";
    };

    outputs = {
        # ...
    };
}
```


Remember that Nix is also a functional programming language (there are a lot of namespace collisions here, I know). In this paradigm, even an attribute set is a function, although a simple [kind](https://en.wikipedia.org/wiki/Kind_(type_theory)). Thus, we can do something like this to the `outputs` attribute:

```nix
{
    # ...
    
    outputs =
        { self, nixpkgs, ... }:
        let
            name = "project-name";
            systems = [ "x86_64-linux" "aarch64-darwin" ];
            pkgs = import nixpkgs { };
        in
            pkgs.mkShell {
                # ...    
            };
}
```


In this instance, `outputs` is bound to a function that takes an extensible set and produces a new set via the function `pkgs.mkShell`. It's easier to see when we map to a Haskell-like grammar:

```haskell
inputs :: Row Type
-- omitted

outputs :: Row Type
outputs = \{ self, nixpkgs } -> do
    let
        name = "project-name"
        systems = [ "x86_64-linux" "aarch64-darwin" ]
        pkgs = import' nixpkgs
    pkgs.mkShell do
        -- omitted
```


This is obviously not a one-to-one mapping, but you get the idea. With that in mind, we are ready to write the internal details of `outputs`.

```nix
{
    # ...

    outputs =
        { self, nixpkgs, ... }:                     # function input
        let
            name = "haskell-project";
            pkgs = import nixpkgs { };
        in
            pkgs.mkShell {                          # function output
                inherit name;
                
                buildInputs = [
                    pkgs.ghc
                    pkgs.haskell-language-server
                    # ...more packages as needed
                ];
            };
}
```

The function `mkShell` essentially produces a *derivation*. This is Nix lingo for a *build task*. Upon invoking [`nix-instantiate`](https://nix.dev/manual/nix/2.18/command-ref/nix-instantiate) this build task will be evaluated and stored in the local host's `/nix/store/`.

This *build task* can be realized into a *build result* with commands such as `nix build` and `nix develop`. Running the latter will build everything and drop us into a Nix shell with all the packages ready for use. The path to these packages contains their individual cryptographic hashes, for example

```sh
/nix/store/xng8wvi7inzybhmaclsb6s8yhmafbq40-nix-prefetch-git 
```


> With the new Nix CLI v3, the hashing of path, instantiating and storing of derivation are combined with building through the commands `nix build` and `nix develop` for a better user interface. Check out the documentation page on [experimental sub-commands here](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix).

Now, if you tried building the flake, you should get an error. We should read the error message and try to understand why.

```sh
$ nix develop         
warning: Git tree '${PATH_TO}/haskell-project' is dirty
warning: updating lock file '${PATH_TO}/haskell-project/flake.lock':
• Added input 'nixpkgs':
    'github:NixOS/nixpkgs/9357f4f23713673f310988025d9dc261c20e70c6\
    ?narHash=sha256-bvGoiQBvponpZh8ClUcmJ6QnsNKw0EMrCQJARK3bI1c%3D' (2024-09-21)
warning: Git tree '${PATH_TO}/haskell-project' is dirty
error: flake 'git+file://${PATH_TO}/haskell-project' does not provide attribute \
        'devShells.x86_64-linux.default', 'devShell.x86_64-linux', \
        'packages.x86_64-linux.default' or 'defaultPackage.x86_64-linux'
```


The error message is informative. It says that the outputs set produced by the function `mkShell` does not contain the attribute `devShells.x86_64-linux.default`. It's a simple fix:

```nix
{
    # ...
    outputs =
        { self, nixpkgs, ... }:                             # function input
        let
            name = "haskell-project";
            system = "x86_64-linux";                        # specifies the system variable, must be a compile time value
            pkgs = import nixpkgs { inherit system; };      # the package set must also contain the system attribute
        in
            devShells.${system}.default = pkgs.mkShell {    # function output, with the system value embedded
                inherit name;
                
                buildInputs = [
                    pkgs.ghc
                    pkgs.haskell-language-server
                    # ...more packages as needed
                ];
            };
}
```

We need to specify the system we are building on. I am using Linux, so I have to specify that system information in order to abide by the law of referential transparency. The following is the list of all systems available for you to pick from

```nix
systems = [ "x86_64-linux" "x86_64-darwin" "aarch64-darwin" "aarch64-linux" ];
```

That compiles. Now we are in a working Nix shell. Congratulations, you just created and built your first Nix flake!

I recommend testing with other variants of Nix flake. There are multiple sources you can reference from. I include a few links below. Happy hacking!


### Links

- For the first-principled folks, I highly recommend *The Purely Functional Software Deployment Model* thesis [from E. Dolstra](https://edolstra.github.io/pubs/phd-thesis.pdf), the author of Nix himself.
- This [book](https://nixos-and-flakes.thiscute.world/nixos-with-flakes/introduction-to-flakes) provides an excellent historical context for the fragmented state of the Nix ecosystem. It informed my suggestion to focus on *Flake* from the beginning.
- Nix templates for reference
    - https://nixos.wiki/wiki/Flakes
    - https://input-output-hk.github.io/haskell.nix/tutorials/getting-started-flakes.html
    - https://github.com/thomashoneyman/purescript-halogen-realworld/blob/main/flake.nix
    - https://github.com/input-output-hk/iogx/blob/main/flake.nix
