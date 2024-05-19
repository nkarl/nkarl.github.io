---
title: 'Object-Oriented Programming – a Review'
description: 'I reviewed OOP.'
pubDate: 'May 18 2024'
---

Let's review Object-Oriented Programming (OOP).

There are 4 attributes fundamental to the OOP paradigm:

- encapsulation
- (data) abstraction
- inheritance
- polymorphism

It is important to remember that these 4 attributes are closely connected.

- __Encapsulation__ is the act of capturing some information and compressing it under a symbol.
	- [A name is a kind of symbol](https://docs.github.com/en/repositories/working-with-files/using-files/navigating-code-on-github#using-the-symbols-pane); it is a placeholder for something larger underneath.
- __Abstraction__ is the act of generalizing. In fact, I prefer the word _generalization_.
	- Generalization is an _inductive process_. We observe a range of phenomena and notice that some actions or events recur. We record, identify and label them as a set of common attributes for these phenomena.
- __Inheritance__ is the act of reusing some generalized attributes.
	- Let's say we observe a new class of phenomena. We notice that it has _at the very least_ some attributes we already found. So we let the new type inherit the set of generalized attributes. Then, we add the attributes unique only to the new class of phenomena.
- __Polymorphism__ is the idea that: once we have a generalized base type, we then can [morph](https://en.wikipedia.org/wiki/Animorphs) the base type into a bunch of similar types, each have their own variant actions.

Here I want to make a bold claim that object-oriented programming is actually more closely related to Functional Programming (FP) for the same 4 reasons above. I will demonstrate with an example. I also will use 'object-class' and 'type' synonymously.

### A Simple Example

We want to define a simple taxonomy.

- An animal is an organism.
- A plant is also an organism.
- Both types are organic life, because they both have 'breathing' as a fundamental attribute. 

```java
class Organism {
    Element element = Element.Carbon; // enum predefined elsewhere
    void breath() { }
}
class Animal extends Organism {
    bool canMove = true; 
}
class Plant extends Organism {
    bool canPhotosynthsize = true;
}
```

However, because of [the diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance), the [Elysia Chronotica](https://en.wikipedia.org/wiki/Elysia_chlorotica?useskin=vector) is explicitly forbidden by classical Java from being defined. We cannot do the following:

```java
class Elysia extends Animal, Plant {}
```

This raises a problem: at some point we need to differentiate between state and action attributes. Enters _interface_ as a new way to organize action-based attributes. _Interface_ allows a type to be extended with many sets of action-based attributes.

Originally Java did not have _interface_. It was only capable of having object-class definitions.

### Modeling

Let's take a detour and see how we might implement this in Haskell. Note that the keyword `class` denotes _typeclass_ in Haskell. A _typeclass_ should be more accurately read as "given some data <u>type</u> to be modeled, we expect it to exhibit this <u>class</u> of actions".

For the sake of simplicity, we do not concern ourselves with strict scientific definitions and semantics here.

An _Elysia Chronotica_ (__encapsulation__) is a type of animal (__inheritance__) that exhibits these actions (__generalization__):

- it `lives`, which demonstrates by its ability to `breath`.
- it `moves`, which is an action common to most animals.
- it `photosynthesizes`, which is an action common to most plants.

Every action has an input and output. To keep it simple, we reduce the order of complexity into a single ouput for each function, abstracting away the input and everything else in between. We also place a constraint that these actions are defined for _Elysia Chronotica_ (__monomorphism__):

- `breath` produces `CO_2` as output.
- `photosynth` produces `O_2` as output.
- `move` is a little bit more complicated. Movements involve pathing, with a pair of start- and end-points. This pair contains more information and thus more useful to us. Thus, we will let it produce a coordinate tuple `(from, to)`.


<blockquote style='color:green;font-size:1em;padding:0 0.75em;margin-left:2em'>
A note on polymorphism.

We defined those actions as mono-morphic. To cover for creatures that produce output other than gases, we can define more general functions. These would be poly-morphic <em>on the type</em> of their output.
</blockquote>

```haskell
data Where  = Here | There deriving (Show)
data Output = CO_2 | O_2   deriving (Show)

-- defines the actions pertaining to being alive
class Livable where
    breath :: Output
instance Livable where           -- implementation
    breath = CO_2

-- defines the actions pertaining to capable of moving
class Movable where
    move :: Where -> Where -> (Where, Where)
instance Movable where           -- implementation
    move from to = (from, to)

-- defines the actions pertaining to being plant-like
class Photosynthesizable where
    photosynth :: Output
instance Photosynthesizable where -- implementation
    photosynth = O_2

-- constructor for the type Elysia, of which every elysia is an instance
data Elysia
	= Elysia
	{ it_breathes     :: Output
	, it_moves        :: (Where, Where)
	, it_photosynthes :: Output
	, it_is_named     :: String
	} deriving (Show)
```

Now the same implementation in Java:

```java
enum Where  { Here, There }
enum Output { CO_2, O_2 }

// defines the actions pertaining to being alive
interface ILivable {
    default Output breath() {
        return Output.CO_2;
	}
}
// defines the actions pertaining to capable of moving
interface IMovable {
    default Tuple<Where, Where> move(Where from, Where to) {
        return new Tuple(from, to);
	}
}
// defines the actions pertaining to being plant-like
interface IPhotosynthesizable {
    default Output photosynthesize() {
        return Output.O_2;
	}
}
class Elysia implements ILivable, IMovable, IPhotosynthesizable {
    // other init such as constructor(s) omitted
    String name() { get; }
}
```

This example has demonstrated that there are universal similarities between the two languages (and thus paradigms). This is despite the differences in syntax and semantics. Having become more familiar with Haskell, I find more comfort in the functional approach in terms of reasoning and modeling for the sake of correctness. I will explain why.

#### Where They Diverge

In the functional approach, actions matter insofar as they produce some results that we anticipate. The objects themselves are simply records instantiated for the sake of getting to the results.

On the other hand, there is an over-emphasis on the object-class in OOP. The point of reference is on the structure of the objects themselves, not the actions and thus data. Because of this we had to come up with many language specifics over the years such as static methods, default interface methods, overriding methods and so on. This in my opinion is not ideal, especially when coupled with highly verbose languages.

At some point, it seems to me that the focus on the data was lost, and the structure of the container took over and flooded the arguments.

### The Problem that OOP Addressed

This is not to say that OOP is bad. It is important to know the limitations of our tools. Every language has arrived on the scene to address a very specific set of problems at its time. In fact, Java was so successful that it dominated the entire field for the next 20 years. That means that the problems it solved had to be equally impressive.

I believe OOP solved a very specific problem: the problem of lexical contexts.

It used to be the case that *all* variables are shoved into a global namspace, which leads to mutations (and bugs) that are impossible to track as applications scale up. Given all the `extern` declarations in C and C++, things spiral out of control fast. It is hellish to debug and develop for large and enterprise-classed applications in this manner.

There has to be a way to "tag" variables according to their scope of use. In fact, it is better for development and maintenance (and developer sanity) that variables should live and die within their own lexical scopes. They shouldn't be managed by the developers manually. OOP solves this problem. Object-classes are infact a form of tagging to track lexical contexts. An OOP program always starts with a main class, which wraps all other object instances. Everything is more easily traced into a tree graph by following the footprint of instantiated objects.

### Final Thoughts

In fact, in my opinion it is more accurate to categorize the landscape of programming as a gradient around two poles: _functional programming_ and _masonic programming_.

- The first paradigm aims for maximal correctness in mapping between theory and implementation.
- The second paradigm aims for maximal performance and velocity of implementation due to being closer to bare metals.

The first paradigm naturally introduces constraints into the system. This is required at some point when the need for scaling emerges. For this reason, Java would fall into the first category. C on the other hand demands freedom from constraints, because performance demands simplicity. A C developer would say "We live day-to-day in a Newtonian world not a quantum-field world. We don't need to do a gradient descent every time we take a step forward. That would be ridiculous. We just walk ahead one step forward."

<blockquote class="twitter-tweet" data-conversation="none" data-dnt="true" style='color:green;font-size:1em;padding:0 0.75em;margin-left:2em'><p lang="en" dir="ltr">And it&#39;s not just about &quot;laziness&quot; either. There is a spirit that WANTS to be poor and wandering. This is very hard to understand for some people for whatever reason. The spirit of poverty is important to the survival of civilization. It has some important roles to play.</p>&mdash; Matthieu Pageau (@PageauMatthieu) <a href="https://twitter.com/PageauMatthieu/status/1780956346961047568?ref_src=twsrc%5Etfw">April 18, 2024</a></blockquote>

The kind of programmers who opt for speed and performance do not want to be constrained. And they should not be, because they already conform themselves into pursuing speed and performance.

As is everything else in life, the balance lies somewhere between the two poles.

