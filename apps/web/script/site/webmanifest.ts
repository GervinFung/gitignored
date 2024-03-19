import fs from 'fs';

import pkg from '../../../../package.json';

const main = () => {
	const dimensions = [72, 96, 128, 152, 192, 384, 512] as const;

	const webmanifest = {
		name: pkg.name,
		short_name: pkg.name,
		description: pkg.description,
		theme_color: 'site_color_unknown',
		background_color: 'site_color_unknown',
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
						purpose: 'maskable',
					};
		}),
	};

	const stringifiedWebmanifest = JSON.stringify(webmanifest, undefined, 4);

	fs.writeFileSync('public/site.webmanifest', stringifiedWebmanifest);

	fs.writeFileSync('public/manifest.json', stringifiedWebmanifest);
};

main();
