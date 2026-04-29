import js from '@eslint/js';
import ts from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import prettier from 'eslint-config-prettier';
import turbo from 'eslint-config-turbo/flat';
import globals from 'globals';

export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...sveltePlugin.configs['flat/recommended'],
	prettier,
	...turbo,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
				svelteFeatures: {
					runes: true
				}
			},
			globals: {
				$state: 'readonly',
				$derived: 'readonly',
				$effect: 'readonly',
				$props: 'readonly',
				$bindable: 'readonly',
				$inspect: 'readonly',
				$host: 'readonly'
			}
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off'
		}
	},
	{
		ignores: [
			'**/dist/**',
			'**/.svelte-kit/**',
			'**/build/**',
			'**/node_modules/**',
			'**/*.lock',
			'**/.env',
			'**/.env.*',
			'!**/.env.example'
		]
	}
];
