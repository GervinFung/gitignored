# **Git-Ignored**

A web application that let developer generate various `.gitignore` templates

The templates are taken from the repo [gitignore](https://github.com/github/gitignore) of GitHub. Hence the templates generated are reliable

Here's what the developers can do with it

1. Combine various templates into one to preview and/or download it
2. Leave the generated templates as it is to preview and/or download it

## Preview

#### Main Page

![Home](./docs/main.png 'Home')

#### Templates

![Templates](./docs/templates.png 'Templates')

#### More Templates

![More Templates](./docs/more-templates.png 'More Templates')

#### Of course, footer

![Footer](./docs/footer.png 'Footer')

## Environment Variables

#### Development and Testing

Refer to `.env.example` which is an example file for you to know what key-value pairs are needed to develop this project

Then, create an `.env` file and copy the key-value pairs to it and then change the values

#### Production and Staging

Refer to `.env.production.example` to know what key-value pairs are needed for deployment

Then, create an `.env.production` file and copy the key-value pairs to it and then change the values

## Contribution

**Make sure you can run `make`, otherwise, you need to run commands listed in `Makefile` separately**

1. Open an issue
1. Fork this repo
1. Use TypeScript
1. Write test

## Test

It's not necessary to write test for UI but it's a must to write test for logical processing functions
