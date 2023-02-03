import fs from 'fs';
import pkg from '../../package.json';
import theme from '../../src/web/theme/theme';

const main = () => {
    const dimensions = [48, 72, 96, 144, 192, 256, 384, 512] as const;

    const webmanifest = {
        name: pkg.author,
        short_name: pkg.author,
        icons: dimensions.map((dimension) => ({
            sizes: `${dimension}x${dimension}`,
            src: `/images/icons/icon-${dimension}x${dimension}.png`,
            type: 'image/png',
        })),
        theme_color: theme.pureWhite,
        background_color: theme.pureWhite,
        display: 'standalone',
    };

    fs.writeFileSync(
        'public/site.webmanifest',
        JSON.stringify(webmanifest, undefined, 4)
    );
};

main();
