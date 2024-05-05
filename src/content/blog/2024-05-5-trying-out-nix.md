---
title: 'Playing with Nix'
description: 'In this blog, I begin playing with Nix the systems set up and config manager.'
pubDate: 'May 05 2024'
---

I got some time, so I had a look into [Nix](https://nix.dev/).

## What is Nix?

Nix is basically a management system for maximizing the automation and reproducibility of system setup and configuration.

I already had an inkling of what it does before coming in. What I didn't know is that Nix has a functional language at its core. In fact, Nix has a *functional package language*, a DSL also called Nix, for the sole purpose of managing and reproducing system configurations. This is a pretty fun finding after learning PureScript and Haskell.

Ultimately, Nix is very similar to how I have been managing my NeoVim configuration for multiple devices. Nix should be a little more complex because of its responsibility, but the principle should be the same.

<blockquote style='color:green;font-size:1em;padding:0 0.75em;margin-left:2em'>
<p>
For every reproducible system, there should be at least one and up to a few core config files.
</p>
</blockquote>

Nix relies on these files to build or rebuild the system. Now, this is where Nix shines: every build/rebuild generate a new snapshot. In other words, building/rebuilding a Nix system is always **generative**. This is why Nix users can experiment and customize their systems without fear. If something unexpectedly breaks, you can simply take out the breaking dependency and rebuild to an earlier version. Or even simpler, you can revert to an earlier snapshot (that *has not been garbage collected*).

<blockquote style='color:green;font-size:1em;padding:0 0.75em;margin-left:2em'>
<p>
Here, we can see that immutability is directly related to accountability and consistency.

We write codes, and then tell the build system to compile and generate a binary executable, which we run as an application. A good build system can detect code changes and rebuild only the changed files. Some build systems allow us to specify tags to differentiate between snapshots. And then there is Git, which documents the entire history of changes for accountability. Consistency-wise, we are satisfied if we can produce the same outcome from the same code.

Nix takes all of these principles and applies them to the configuration of systems.
</p>
</blockquote>


## Choosing an Entry Point

From the brief scan, I can see that Nix is separated into two major classes of application:

1. Nix shell (a shell inside an existing environment like Windows, Ubuntu, etc.)
2. NixOS (a complete OS).

The first option is the starting place for pretty much everyone. Once we have gotten a good feel around Nix, we might consider using it as our main OS. I will start with the <strong style='background:yellow'>Nix shell</strong>.

## Starting a Nix Shell Instance

For this foray into Nix, I will use the Nix Docker image. The goal is to maximize understanding, which means that configurations will be highly volatile. Thus, it is imperative that they are isolated from my main system.

```sh
docker run -it nixos/nix
```

From here, we begin to play with the *shell environments*.

<blockquote style='color:green;font-size:1em;padding:0 0.75em;margin-left:2em'>
<p>
If you don't have any systems background, here is a short explanation of what a shell is.

Every computer runs on an OS, and at its core is something called a "kernel". We don't interact with the kernel directly for economic and security reasons. Rather, we use shells. The most simple shell is a terminal interface, which is all text-based. Graphical interfaces are a type of shell for good feelings with the obvious added complexity.
</p>
</blockquote>

From the default Docker shell, we can can start any *ad hoc* Nix shell instances by running `nix-shell` with at least one package specified (a dependency).

```sh
nix-shell -p nodejs
```

```sh
# we are now inside a nix-shell instance
[nix-shell:] node --version
v18.18.2 # output
```

The [official Nix doc](https://nix.dev/tutorials/first-steps/ad-hoc-shell-environments) provides a ridiculous example via the two packages `cowsay` and `lolcat`. If you are a complete newbie, you would run it and be like "OK, what the heck does that mean?"

I will break that down for you.

1. We start a new `nix-shell` instance with those two packages.
	- Remember that we need *at least one* package to start a shell? That dependency requirement is satisfied; we have two.
2. Next, `cowsay` and `lolcat` are themselves two small programs.
	- `cowsay` takes some text and draws a silly looking horse with a speech bubble above it.
	- `lolcat` means `cat` with funsies. It is a command that runs the text through a color filter, and then concatenates to the standard output (the terminal interface).

Every Nix shell instance is isolated from the Docker root environment. The two programs can only be run inside this particular Nix shell instance that has them as dependencies.

There, we just created our first Nix shell instances. 

Ultimately, we want to have a configuration we use independently of platforms. That is by definition *reproducible*. That requires a few core config files.

In the next post we will create a default config file with a few standard dependencies.
