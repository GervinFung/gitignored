import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	entry: [
		'pages/api/**/*.ts',
		'pages/**/*.tsx',
		'src/**/*.tsx',
		'src/**/*.ts',
		'script/**/*.ts',
	],
	ignore: ['next-sitemap.config.js', 'public/**.js'],
	ignoreBinaries: ['make'],
	ignoreDependencies: [
		'vite-node',
		'next-sitemap',
		'prettier',
		'eslint',
		'supabase',
	],
};

export default config;
