---
title: Nix Flakes
description: I documented a few things I learned about Nix and Nix flakes.
pubDate: Sep 26 2024
---

I recently encountered a problem while building a Docker image.

The image has a few large git dependencies which flooded the bandwidth of my home network, resulted in [an RPC error on cloning](https://stackoverflow.com/questions/38618885/error-rpc-failed-curl-transfer-closed-with-outstanding-read-data-remaining/79004075#79004075). It was a kind of hair-pulling frustration, because each time it takes so long to rebuild only for it to fail half way through. I definitely [screamed](https://youtube.com/shorts/ay_F-Y7mERk?si=B-65td2XWraizXHn) a few times.

After some tinkering I reorganized the Dockerfile, which somewhat addressed the build time problem. At this point however, I got fatigued with Docker, so I looked into other ways to manage dependencies. I revisited Nix, spending about a week time on reading and poking at it repeatedly.
 
I think Nix is a fascinating and deeply useful tool. In this article, I document a few things I have learned about it.

### where to start

> - Nix, as a programming language, is purely functional
> - Nix, as a programming memory model, operates on the file system
> - Nix, as an ecosystem, has *Flake* as the most recent major feature
>     - similar to `package.json` or `stack.yaml` or `cabal.project`.
>     - more, we can control system builds as programs.

In order to get the ball rolling with Nix as quickly as possible, I recommend that you 
- ignore **NixOS** completely.
- install **Nix** on your system; I am the only user of my system so I chose single-user.
- start with **Nix Flake**.

### exposition on Nix

As *a tool for managing and building system dependencies*, Nix offers environment isolation, caching and deterministic reproducibility.

When you install Nix as recommended, you install a handler into your user space that can parse and evaluate `*.nix` files via various Nix commands. This handler can retrieve and build dependencies that are already indexed in a remote repository. It can also create an isolated shell with env variables for development or deployment.

- First, this solves the problem of dependency management via the remote index. You just need to look at StackOverflow to see the heap of questions on missing packages.
- Second, the dependencies are then build and cached on the local host, making subsequent build times much shorter.
- Third, all dependencies are indexed and stored by their cryptographic hashes. This is true for both the remote and local stores. This is significant. This means we can replicate the build outputs with 100% certainty by using the same hashed packages for inputs.

### on ~~NixOS~~

The reason you should ignore NixOS is an economic one.

Most developers are gerrymandered into 3 territories: Windows, MacOS and an opaque blob of Unix distros. This is a just a fact of life. It is then logical to infer that most developers would prefer to stick with the systems they are familiar with. We all feel more at home with the tools that we own.

In any case, the costs of migrating to a new OS is simply too high for most people, especially without a good reason and plan.

Therefore, I recommend an *isolation level on a per-project basis* via Nix Flake. It is a more sensible approach to Nix. More below.

### on Nix flakes

At the time of this article, *Flake* is still an *experimental feature* in the Nix ecosystem.

However, it [makes so much sense](https://grahamc.com/blog/flakes-are-an-obviously-good-thing/) that it gained a [sudden growth spurt](https://www.tweag.io/blog/2022-08-04-tweag-and-nix-future/). It is even deeply integrated into the development and deployment of some major infrastructure. An example is [the Cardano blockchain node](https://github.com/IntersectMBO/cardano-node/blob/master/flake.nix). 

From a developer's standpoint, you can think of a flake as being similar to `package.json` or `pom.xml`. Be mindful that this is not a one-to-one mapping, because Nix flakes are much more powerful than JSON or XML files. It is indeed helpful, however, to prepare some ground to stand on first.

### on Nix flakes as turbo manifests

The major difference of a `flake.nix` over other manifest types is actually from the programming language model (Nix) that encapsulates and operates on these flakes. 

In many popular frameworks such as Maven and Node.js, manifest files are typically *package manifests*. They specify a set of metadata that include dependencies for an application, and at best a few scripts for building and running it. They are simply a side effect of the main application.

```json
{
    // ...
    "scripts": {
        "build": "spago build",
        "test": "spago test",
        // ...
    },
    "dependencies": {
        // ...
    }
}
```

From a host environment's standpoint, these package manifests are completely dependent on the host's context. In other words, they depend on a prior configure step that should prepare a shell with all required system dependencies. This step is often carried out by the developers. A Docker container is also a kind of build pre-configuration. A Docker image is often built through a pair of `Dockerfile` and `docker-compose.yaml` manifests.

Nix Flake is a type of manifest designed for this step. Nix as a language more generally models this pre-configure step.

In a flake, you specify both the *inputs* and *outputs* for sourcing and building your dependencies, like a mathematical equation.

- In the `inputs` attribute, you define where to source your packages.
- In the `outputs` attribute, you have a few options. You can define a simple attribute set as expectation for the build output, just like `inputs`. Not only that, you also have the power to define various actions that ultimately creates the expected attribute set. This is possible due to Nix's design.
   - For example, you can embed program logic such as a custom parser for other manifests. I know about this because [I reported a bug in the parser from IOHK's HaskellNix template](https://github.com/input-output-hk/haskell.nix/issues/2252#issue-2537768257).

> You can look at every Nix file as a [mathematical object](https://ncatlab.org/nlab/show/object) (a high-ordered function) that can accept some arguments and produces some result that can be passed on to other mathematical objects (Nix files).

You can use a flake to set up an isolated instance from within the host environment. This instance, derived from a translation unit called *derivation*, has its own environment path and variables. The derivation is hashed and stored, allowing for 100% reproducibility.

### from zero to one Nix flake

The best way to understand something is to use it. I recommend starting with a simple flake structure and use it repeatedly until you are ready to advance to more complex variants. Let's try to make one ourselves.

Every flake is a [hash set](https://nix.dev/tutorials/nix-language.html#attrset) with two attributes `inputs` and `outputs`, each in turn is another attribute set. As a side note, this is an example of [recursive data type](https://en.wikipedia.org/wiki/Recursive_data_type). In the `inputs` attribute set you can declare a pointer to some index to source your packages, most commonly `github:nixos/nixpkgs/nixos-*`. This index is versioned and managed by the Nix community:

- `github:nixos/nixpkgs/nixos-unstable` is the latest
- `github:nixos/nixpkgs/nixos-24.05` (same tip as `unstable` at the time of writing)
- `github:nixos/nixpkgs/nixos-23.11`
- `github:nixos/nixpkgs/nixos-23.05`
- ...

You can browse all versions of the index [here](https://lazamar.co.uk/nix-versions/).

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


Remember that Nix is also a functional programming language (namespace collisions, I know). In this paradigm, even an attribute set is a function, although a simple [kind](https://en.wikipedia.org/wiki/Kind_(type_theory)). Thus, we can do something like this to the `outputs` attribute:

```nix
{
    # ...
    
    outputs =
        { self, nixpkgs, ... }:
        let
            name = "project-name";
            system = "x86_64-linux";
            pkgs = import nixpkgs { };
        in
            pkgs.mkShell {
                # ...    
            };
}
```


In this instance, we define an anonymous function that accepts a set of variadic arguments and produces a new attribute set by invoking the `pkgs.mkShell` function. It's easier to see when we map to a Haskell-like grammar:

```haskell
data Flake = Flake { inputs :: Set, outputs :: Set }

inputs :: Set
-- omitted

outputs :: Set
outputs = \{ self, nixpkgs } -> do
    let
        name = "project-name"
        system = "x86_64-linux"
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

The function `mkShell` produces a *derivation*. This is Nix lingo for a *build task*. Upon invoking [`nix-instantiate`](https://nix.dev/manual/nix/2.18/command-ref/nix-instantiate) this build task will be evaluated for a cryptographic hash, and stored in the local host's `/nix/store/`.

This build task can then be realized into a *build result* with commands such as `nix build` and `nix develop`. Running the latter will build everything and drop us into a Nix shell with all the packages ready for use. The path to these packages contains their individual cryptographic hashes, for example:

```sh
/nix/store/xng8wvi7inzybhmaclsb6s8yhmafbq40-nix-prefetch-git 
```

> Check out the documentation page on [experimental sub-commands here](https://nix.dev/manual/nix/2.18/command-ref/new-cli/nix).


### double check

Now, if you tried building the flake, you should have got an error. Let's read the error message and try to understand why.

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

What happened there?

The error message says that the function `mkShell` produced an output that does not contain the attribute `devShells.x86_64-linux.default`. This violated functional purity, because in the [schema](https://nixos.wiki/wiki/Flakes#Output_schema), `outputs` requires explicitly that attribute.

We need to specify the system we are building on. I am using Linux on a 64-bit system, so I have to specify that precise system information in order to abide by the law of referential transparency. Recall that an exact input value must be given for the result to be replicable with 100% certainty. The Nix compiler will check the grammar before it executes the build task. It will not execute illegal language statements.

It's a simple fix:

```nix
{
    # ...
    outputs =
        { self, nixpkgs, ... }:                             # function input
        let
            name = "haskell-project";
            system = "x86_64-linux";                        # specifies the value of the `system` attribute; must be a compile time value
            pkgs = import nixpkgs { inherit system; };      # the `pkgs` set must also contain the `system` attribute
        in
            devShells.${system}.default = pkgs.mkShell {    # function output; embedded with the value of `system`
                inherit name;
                
                buildInputs = [
                    pkgs.ghc
                    pkgs.haskell-language-server
                    # ...more packages as needed
                ];
            };
}
```

That compiles. Now we are in a working Nix shell.

Below is the list of all systems available for you to pick from. On Windows, it might be possible to install Nix into a WSL.

```nix
systems = [ "x86_64-linux" "x86_64-darwin" "aarch64-darwin" "aarch64-linux" ];
```

### finally

Congratulations, you just created and built your first Nix flake!

I recommend trying out a few Nix Flake variants. There are multiple sources you can reference from. I include a few links below.

Happy hacking!


### links

- For the first-principled folks, I highly recommend *The Purely Functional Software Deployment Model* thesis [from E. Dolstra](https://edolstra.github.io/pubs/phd-thesis.pdf), the author of Nix himself.
- This [book](https://nixos-and-flakes.thiscute.world/nixos-with-flakes/introduction-to-flakes) provides an excellent historical context for the fragmented state of the Nix ecosystem. It informed my suggestion to focus on *Flake* from the beginning.
- Nix templates for reference
    - https://nixos.wiki/wiki/Flakes
    - https://input-output-hk.github.io/haskell.nix/tutorials/getting-started-flakes.html
    - https://github.com/thomashoneyman/purescript-halogen-realworld/blob/main/flake.nix
    - https://github.com/input-output-hk/iogx/blob/main/flake.nix
