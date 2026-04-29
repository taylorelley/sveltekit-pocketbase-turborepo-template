import sharedConfig from '@repo/eslint-config';
import svelteConfig from './svelte.config.js';

export default [
	...sharedConfig,
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				svelteConfig
			}
		}
	}
];
