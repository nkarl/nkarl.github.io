import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
//import remarkMermaid from "astro-diagram/remark-mermaid";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import rehypeMermaid from "rehype-mermaid";

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  markdown: {
    syntaxHighlight: false, // disabled in order to use rehype plugins
    shikiConfig: {
      //theme: "material-theme",
    },
    remarkPlugins: [
      remarkMath,
      //remarkMermaid
    ],
    rehypePlugins: [
      rehypeKatex,
      [rehypeMermaid, { strategy: "img-svg" }]
    ],
  },
  site: 'https://nkarl.github.io',
  integrations: [
    //starlight(),
    mdx(),
    sitemap(),
  ],
});
