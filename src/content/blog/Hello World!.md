---
title: 'Hello World!'
description: 'Trying out the MDX blog with Astro.'
pubDate: 'April 14 2024'
---

I have wanted to start a blog for a while, but kept delaying for many reasons.

One is that I have been writing in private for years using Markdown with custom HTML and CSS embedded in. I am so used to this style that it feels really restricted using anything else. I needed a blog template that is easy to spin up and deploy via GitHub Actions. I was looking at Svelte but it seemed a bloated at a glance, which is quite a funny thing to say because Svelte is supposed to address the bloat problem of React. Anyways I eventually found Astro.

Now, there is nothing wrong with Svelte. It is a great framework, actually. It is just that my use case is very narrow: a blog with static content. Svelte excels at building full-fledge web applications. It is overkill for my purpose. Astro on the other hand is a *static site generator*, which is perfect for me.

Anyways, now that I have a blog again, I will publish consistently.

Looking forward to all ahead!

Finally, as a token of celebration, here is a `Hello World!` in PureScript. 😀

```haskell
import Prelude
import Effect (Effect)
import Effect.Console (log)

hello :: String
hello = "Hello World!"

main :: Effect Unit
main = do
    log $ hello
```
