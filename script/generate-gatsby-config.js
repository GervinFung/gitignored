import * as fs from 'fs';
import dotenv from 'dotenv';
import { parseAsStringEnv } from 'esbuild-env-parsing';

(() => {
    dotenv.config({});
    const nodeEnv = parseAsStringEnv({
        env: process.env.NODE_ENV,
        name: 'NODE_ENV',
    });
    // ref: https://www.gatsbyjs.com/plugins/gatsby-source-mongodb/
    fs.writeFile(
        'gatsby-config.js',
        `const dotenv = require('dotenv');

console.log('generated gatsby-config.js')

dotenv.config({ path: '.env${nodeEnv === 'test' ? '.test' : ''}'});

module.exports = {
    siteMetadata: {
        title: 'gitignore',
        url: '${
            nodeEnv === 'development'
                ? 'http://localhost:8000/'
                : 'https://gitignored.gtsb.io/'
        }',
        description:
            'Generate .gitignore templates that was obtained from GitHub',
        author: 'PoolOfDeath20',
        keywords: 'gitignore, GitHub gitignore, gatsby, git',
        image: './static/images/git-ignored-logo.png',
    },
    plugins: [
        'gatsby-plugin-styled-components',
        'gatsby-plugin-image',
        'gatsby-plugin-sharp',
        'gatsby-transformer-sharp',
        {
            resolve: 'gatsby-plugin-env-variables',
            options: {
                allowList: [
                    'MONGO_DB',
                    'MONGO_COLLECTION_TECH',
                    'MONGO_COLLECTION_UPDATE_TIME',
                    'MONGO_ADDRESS',
                    'MONGO_SRV',
                    'MONGO_USER',
                    'MONGO_PASSWORD',
                    'NODE_ENV',
                ],
            },
        },
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
};`,
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
})();
