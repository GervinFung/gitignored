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
        'gatsby-config.ts',
        `import type { GatsbyConfig } from 'gatsby';
import dotenv from 'dotenv';

dotenv.config({ path: '.env${nodeEnv === 'test' ? '.test' : ''}'});

const config: GatsbyConfig = {
    siteMetadata: {
        title: 'gitignore',
        url: '${
            nodeEnv === 'development'
                ? 'http://localhost:8000/'
                : 'https://www.gitignored.com'
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
            //@ts-ignore
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
            //@ts-ignore
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
