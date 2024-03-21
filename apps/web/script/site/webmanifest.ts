import fs from 'fs';

import pkg from '../../../../package.json';

const main = () => {
	const dimensions = [48, 72, 96, 144, 192, 384, 512] as const;

	const webmanifest = {
		name: pkg.name,
		short_name: pkg.name,
		description: pkg.description,
		start_url: '/',
		theme_color: '#FFF',
		background_color: '#FFF',
		display: 'standalone',
		categories: ['development', 'tools'],
		icons: dimensions.map((dimension) => {
			const commonProperties = {
				sizes: `${dimension}x${dimension}`,
				src: `/images/icons/icon-${dimension}x${dimension}.png`,
				type: 'image/png',
			};

			return dimension !== 512
				? commonProperties
				: {
						...commonProperties,
						purpose: 'any',
					};
		}),
	};

	const stringifiedWebmanifest = JSON.stringify(webmanifest, undefined, 4);

	fs.writeFileSync('public/site.webmanifest', stringifiedWebmanifest);

	fs.writeFileSync('public/manifest.json', stringifiedWebmanifest);
};

main();
