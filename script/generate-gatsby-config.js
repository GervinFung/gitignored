import * as fs from 'fs';
import dotenv from 'dotenv';
import { parseAsEnv } from 'esbuild-env-parsing';

(() => {
    dotenv.config({});
    const { env } = process;
    const nodeEnv = parseAsEnv({
        env: env.NODE_ENV,
        name: 'NODE_ENV',
    });
    // ref: https://www.gatsbyjs.com/plugins/gatsby-source-mongodb/
    fs.writeFile(
        'gatsby-config.js',
        `import dotenv from 'dotenv';

console.log('generated gatsby-config.js')

dotenv.config({ path: '.env${nodeEnv === 'test' ? '.test' : ''}'});

const config = {
    siteMetadata: {
        title: 'gitignore',
        url: '${
            nodeEnv === 'development'
                ? 'http://localhost:8000/'
                : 'https://gitignored.gtsb.io/'
        }'
    },
    plugins: [
        'gatsby-plugin-styled-components',
        'gatsby-plugin-image',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: './static/images/',
            },
            __key: 'images',
        },
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                icon: './static/images/git-ignored-logo.png',
            },
        },
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'pages',
                path: './src/pages/',
            },
            __key: 'pages',
        },
    ],
};
export default config;`,
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
})();
