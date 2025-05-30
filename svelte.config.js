import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const DEV = process.env.NODE_ENV !== 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess({ script: true }),

	compilerOptions: {
		modernAst: true,
		dev: DEV,
		hmr: DEV,
	},

	kit: {
		adapter: adapter(),
	}
};

export default config;
