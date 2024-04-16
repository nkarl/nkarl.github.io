---
title: 'Hello World!'
description: 'Trying out the MDX blog with Astro.'
pubDate: 'April 14 2024'
updatedDate: 'April 16 2024'
---

This blog post contains some PureScript code.

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
