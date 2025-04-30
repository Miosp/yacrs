import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const DEV = process.env.NODE_ENV !== 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

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
