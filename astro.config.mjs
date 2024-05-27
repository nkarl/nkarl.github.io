import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
//import starlight from "@astro/starlight";
import rehypeMermaid from "rehype-mermaid";
import remarkMermaid from "astro-diagram/remark-mermaid";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	markdown: {
		shikiConfig: {
			theme: "dracula",
		},
		//remarkPlugins: [remarkMermaid],
	},
	site: 'https://nkarl.github.io',
	integrations: [
		//starlight(),
		mdx({
			remarkPlugins: [
				remarkMath,
				remarkMermaid
				],
			rehypePlugins: [
				rehypeKatex,
				//rehypeMermaid
				],
		}),
		sitemap(),
	],
});
