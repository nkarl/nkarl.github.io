---
title: JSON Parser from Scratch – the Lexer
description: Let's design and build a JSON Lexer. 
pubDate: Dec 15 2024
---

Hello friends!

It's been a while since my last post, but today I have something cool to report. I have been working on a few things concurrently, and one path has led me down to this project as titled.

For various reasons, I never got to learn about compilers during college. Through self-study, I have recently gained enough basic reasoning vocabulary in category theory and ADT system. I am still very much _an advanced beginner_ in functional programming, so I was looking for a small project to frame and join many knowledge points. While looking around for inspiration, I stumbled on [this compiler design course from Carnegie Melon University](https://www.cs.cmu.edu/~janh/courses/411/17/schedule.html). It provided the needed spark to kick start this project.

I plan for this project to constrain and contexualize why functional programming is a powerful and precise paradigm.

A prerequisite is that you have some awareness of the typical shapes of JSON objects, which you might have seen at least once. If not, refer to [the official JSON specs](https://www.json.org/json-en.html). For the technical details about compiler design, you can read lectures 6-8 from the CMU course. If you have any questions, please reach out to me through email.

Now, let's begin.

## design

The JSON parser is composed of at least 2 components: a lexer and a parser.

The Lexer's responsibility is to scan the input data (a continuous string) character by character. For each letter symbol, It will attempt to map to _either_ a simple token _or_ an entry point, the latter into a lexical context so as to produce a more complex token. The Lexer can reduce as much as 80% of the work for the Parser later.

Once the input has been tokenized, we then pass the list of tokens to the Parser in order to be transformed into an _Abstract Syntax Tree_ (AST). This is where the grammar and syntax required by the JSON specs come into play.

In this post, we focus on the Lexer.

### the Lexer

The Lexer can be thought as a _data pre-processor_. It needs to handle as many edge cases and as early as possible. Categorizing errors and catching them early on helps relieve the Parser and clarify its purpose, letting it focus only on transforming tokens into an AST.

What do these lexing errors look like?

As an example, the Lexer should terminate when it encounters an empty input. Another example is when we need to lex and tokenize an unterminated string. Remember that the Parser should not have to worry about these errors.

A typical JSON string is enclosed in a pair of double quotes. For the sake of simplicity, we will handle double quotes only. An unterminated string does not close out with the second double quote as seen below:

```jso
// error
[ "abc ]
```
```json
// correct
[ "abc" ]
```

In this situation, we only need to check for 2 cases: *either* we see a terminal token (the second double quote) *or* we see nothing as we reach the end of input. Here, it would be great to have rich error reports. Thus, we can employ an `Either a b` monad to represent these 2 branches. It branches to the `Left` on error signals, and `Right` for successful lexing states.

However, before we continue, we need to pull back and model a finite automaton (or a finite state machine, FSM) for our Lexer:

$$
FSM = \{ \Sigma, X, T, Q \}
$$

where
- $\Sigma$ is the lexicon.
    - any symbols in `[a-z][A-Z][0-9]` as well as some operator symbols for enclosure and separation.
    - neccessarily requires at least one function for mapping between a character to an accepted token.
- $X$ is the input string.
    - the input follows a _consuming model_, i.e. each character symbol is consumed on match.
    - in C, you will likely use the _indexing model_ to track the positions of various symbols in the input.
- $T$ is the set of output tokens.
    - the size of $T$ is bounded up to the size of input $X$.
- $Q$ is the set of states.
    - reflecting the changes in the input and the list of output tokens.
    - necessarily requires at least a transition function.
- various transition functions, which might commute.

#### lexicon of symbols and tokens

First, we define a lexicon. The lexicon maps a letter (or group of contiguous letters) in the input to a token.

We now notice that there are 2 groups of tokens.

There are meta-tokens such as the braces, brackets, double quotes, colons and commas. These tokens either delimit or provide boundaries separating the data elements. These tokens are single-point because each is represented by a single character symbol.

On the other hand, there is another group of tokens. I call these multi-point tokens. Each token of this type is composed of a vector of character symbols. For example, both `String "abc"` and `Number 123` are vectors of points. The first is a vector of letters – it is _at least a monoid_, to be more precise. The second is a vector of digits that is then further collapsed to a valued point in the domain of intergers.

Each requires a different amount of work. Identifying and categorizing them helps partition our work load and set proper expectations.

Our lexicon needs to reflect these 2 groups. Then, we define our data types and lexicon as follows:

```hs
data MetaToken = DOUBLE_QUOTE | LEFT_BRACE | RIGHT_BRACE | LEFT_BRACKET | RIGHT_BRACKET | WHITESPACE | COMMA | COLON | OTHER

data Token
    = META MetaToken
    | STRING String
    | NUMBER Integer
    | BOOLEAN Bool

lexicon :: Char -> Token
lexicon = case _ of
  '"' -> DBL_QUOTE
  '[' -> LEFT_BRACKET
  ']' -> RIGHT_BRACKET
  '{' -> LEFT_BRACE
  '}' -> RIGHT_BRACE
  ' ' -> WHITESPACE
  ',' -> COMMA
  ':' -> COLON
  _   -> OTHER
```

This lexicon is the entry point into our Lexer, filtering input symbols into various tokenizing paths. The meta-tokens might need only a simple first-order matching. However, for more complex data types like `String`, `Array` and `Object` we will need to define dedicated processor functions. These functions might even need to be defined recursively in terms of one another. For example, an array can be thought as a "chunk" of data elements enclosed in brackets. This "chunk" might contain strings or numbers, which need to be tokenized separately.

The data type `Token` technically can be represented as a data tree, with mutliple prefixes to differentiate the token groups with as much detail as you want. However, we flatten the data type for the sake of simplicity, with only a single prefix for all variants.

Note that it is also quite possible to use the raw symbols such as `"` or `[` as token processing signals. However, a separate data type is useful in many ways and can help us avoid subtle bugs later on. For example, the type name `Token` is clearly more informative than `Char` when we need to pattern match for lexing paths.

Another example, let's say we need to be maximally clear that we have the following JSON array as input:

```json
[ "123", 123 ]
```

Then the following monoid:

```hs
[ META LEFT_BRACKET
, STRING "123"
, META COMMA
, NUMBER 123
, META RIGHT_BRACKET
]
```

will retain all structural information while disambiguating between the string `"123"` and the integer `123`. This is a powerful feature of the Haskell type system. Having well-typed tokens with informative prefixes will be very helpful when we get to building an AST with the Parser.

#### the `LexerM` functor

Finally, we define a functor context to unify the state transitions among various lexing functions. The goal of this functor is to allow fluid accesses to the source input as well as the developing list of tokens, while also providing a handling path for any errors that might arise during the lexing process.

```hs
type LexerM = Either ErrorMsg State
```

where

```hs
type State = (Source, Tokens)   -- represents the state Q of the FSM

type Source = [Char]            -- the input string

type Tokens = [Token]           -- the list of tokens to be developed

-- a coproduct type to control various lexing errors
data ErrorMsg
    = EmptyInput
    | Unterminated MetaToken
```

### a note about early optimization

#### correctness

First, for this project, I am pushing for the model to be as detailed as possible. I aim to make explicit all morphisms where I can. An example of this is opting for the typed lexicon over direct matching on characters, as you have already seen. Because the correct paths neccessarily commute, maximizing information gain should be the goal in the early stage of development.

Once the complete paths have been laid out clearly without any shortcuts, the optimization step naturally follows. Then, we can analyze and compress certain paths if needed.

This is true at least in this particular situation, where i am writing this project by myself. Limited time and manpower constrain my decision space, and my decision space condenses to maximizing information gain.

#### openness

Second, the design remains amorphous. That is, it might change in unpredictable ways as it gets developed. This is why having a good typing system helps anchor the initial design, preventing it from floating too much. Regardless, it is always useful to be maximally open for future changes.

#### addendum

If you are curious about the technical foundation and mathematical proof for this mind set, you might want to check out the [Active Inference: The Free Energy Principle in Mind, Brain, and Behavior](https://www.amazon.com/Active-Inference-Energy-Principle-Behavior/dp/0262045354?crid=1MNVAVAE0VBGT&dib=eyJ2IjoiMSJ9.rb8UdI0eqkqYkA3lek17HgtSKhZzmnE9jIyhCPu23LAqcuPz1IZ4G5vSo3V_aiUVml2I6XCOoxAHGPjSXbi7Sinabaxob4sVjimEoP1cUcp0Vm4Y2zAqBBSs1saheJmcc44dLffAOyhAcwN-djWoSVbpn1_9oxN6u3jwvnSyj-Fx2VP1a2Fa0GP5Q-N7ZQitTZwEJEOUBth2mbAlVcbbf0YsNT-I5Z3peie0nkaQFq8.2f9MEz7pw41hTDjPmvjoI24s5lHvrBRB6IMQ1D8hkPg&dib_tag=se&keywords=free+energy+principle&qid=1734281996&sprefix=free+energy+princ%2Caps%2C268&sr=8-1) by Karl Friston. It is extremely rich and connects a very wide range of technical areas.

## finally

For detailed implementation, you can take a look at the code in [this GitHub repo I set up](https://github.com/nkarl/json-parser-from-scratch).

Feel free to open an issue if you have any questions. Also, You can always reach out to me through my email in [my contact page](/contact).

Take care, and until next time.

## links

1. [the JSON specifications](https://www.json.org/json-en.html)
2. [CS 411 Compiler Design, Carnegie Melon University](https://www.cs.cmu.edu/~janh/courses/411/17/schedule.html)
3. [JSON Parser from Scratch](https://github.com/nkarl/json-parser-from-scratch)


