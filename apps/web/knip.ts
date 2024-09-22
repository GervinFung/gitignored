import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: [
		'pages/api/**/*.ts',
		'pages/**/*.tsx',
		'src/**/*.tsx',
		'src/**/*.ts',
		'script/**/*.ts',
	],
	ignore: ['next-sitemap.config.js'],
	ignoreBinaries: ['make'],
	ignoreDependencies: [
		'eslint',
		'next-sitemap',
		'prettier',
		'supabase',
		'vite-node',
		'@eslint/compat',
		'@eslint/js',
		'typescript-eslint',
	],
};

export default config;
