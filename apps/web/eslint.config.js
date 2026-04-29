import sharedConfig from '@repo/eslint-config';
import svelteConfig from './svelte.config.js';

export default [
	...sharedConfig,
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				svelteConfig
			}
		}
	}
];
