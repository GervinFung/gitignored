# **Git-Ignored**

A web application that let the developer generate various `.gitignore` templates

The templates are taken from the repo [gitignore](https://github.com/github/gitignore) of GitHub. Hence the templates generated are reliable

Here's what the developers can do with it

1. Combine various templates into one to preview and/or download it
2. Leave the generated templates as it is to preview and/or download it

<details>
<summary>Click to preview!</summary>

#### Main Page

![Home](./docs/main.png 'Home')

#### Templates

![Templates](./docs/templates.png 'Templates')

#### More Templates

![More Templates](./docs/more-templates.png 'More Templates')

#### Of course, footer

![Footer](./docs/footer.png 'Footer')

#### 404 Page

![404](./docs/404.png '404')

</details>

## Tech Used

| Aspect                                                                 | Name              |
| ---------------------------------------------------------------------- | ----------------- |
| Development Language                                                   | TypeScipt         |
| Scripting Language                                                     | JavaScript        |
| Testing                                                                | Jest & Esbuild    |
| Styling                                                                | Styled-components |
| Framework                                                              | NextJS            |
| Build Automation Tool                                                  | Make              |
| Text Editor                                                            | NeoVim            |
| Dependency Management                                                  | Pnpm              |
| Continuous Integration, Continuous Delivery, and Continuous Deployment | GitHub Actions    |

#### Make Commands

_*Below are the listed commands that you can use to build/develop/test this app*_

| Command            | Usage                                             |
| ------------------ | ------------------------------------------------- |
| make start         | Start development                                 |
| make install       | Install all dependencies                          |
| make test          | Run all test code                                 |
| make build         | Bundle and build the app                          |
| make typecheck     | Run typechecking for source code                  |
| make lint          | Run linter for source and test code               |
| make format-check  | Run prettier to check source and test code format |
| make format        | Run prettier to format source and test code       |
| make install-mongo | Install MongoDB                                   |
| make setup-mongo   | Setup MongoDB databases and collections           |

## Environment Variables

#### Development and Testing

Refer to `.env.example`, which is an example file for you to know what key-value pairs are needed to develop this project

Then, create an `.env`, file for development and an `.env.test` file for testing. Then copy the key-value pairs to it and then add the values

#### Production and Staging

Refer to `.env.deployment.example` to know what key-value pairs are needed for deployment

Then, you can either

1. Create an `.env.production` and/or `env.staging` file and copy the key-value pairs to it and then add the values
2. Add the key-value pairs to your hosting platform

## Contribution

**Make sure you can run `make`, otherwise you need to run commands listed in `Makefile` separately**

1. Open an issue
1. Fork this repo
1. Use TypeScript
1. Write test

## Test

It's not necessary to write test for UI but it's a must to write test for logical processing functions
