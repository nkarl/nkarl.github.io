---
title: 'Hello World!'
description: 'Trying out the MDX blog with Astro.'
pubDate: 'April 14 2024'
---

I have wanted to start a blog for a while, but kept delaying for many reasons.

One is that I have been writing in private for years using Markdown with custom embedded HTML and CSS. I am so used to this style that it feels really restricted using anything else. I also need something easy to spin up and deploy with GitHub Actions. I was looking at Svelte since I used it before in a small project. However, it appeared a a little bit bloated, which is quite a funny thing to say, because Svelte *does* address the bloatness of React.

Now, there is nothing wrong with Svelte. It is a great framework actually. Svelte excels at building full-fledge web applications, but it is overkill for my purpose. My use case is very narrow: a simple blog. No fancy stuff like reactive components. Eventually I chanced upon Astro. It is a static site generator, which is the perfect tool for the job.

Now that I have a blog again, I will publish consistently.

Looking forward to all ahead!

As a token of celebration, here is a `Hello World!` in PureScript. 😀

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
