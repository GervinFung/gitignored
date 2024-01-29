# **Git-Ignored**

A web application that let the developer generate various `.gitignore` templates

The templates are taken from the repo [gitignore](https://github.com/github/gitignore) of GitHub. Hence the templates generated are reliable

Here's what the developers can do with it

1. Copy various templates as one or download as all into one zip
2. Copy each template without downloading any templates

#### Home Page

![Home](./test/snapshot/snapshot-images/home.png)

#### Templates

![Templates](./test/snapshot/snapshot-images/templates.png)

#### Docs Introduction

![Docs](./test/snapshot/snapshot-images/docs.png)

#### Docs Content

![Docs](./test/snapshot/snapshot-images/docs/content/getting-started.png)

#### Docs API

##### Introduction

![Introduction](./test/snapshot/snapshot-images/docs/api/introduction.png)

##### Commit Time

![Commit-Time](./test/snapshot/snapshot-images/docs/api/commit-time.png)

##### Templates

![Templtes](./test/snapshot/snapshot-images/docs/api/templates.png)

##### Templates Name

![Templtes-Name](./test/snapshot/snapshot-images/docs/api/templates-name.png)

#### 404 Page

![404](./test/snapshot/snapshot-images/error.png)

## Tech Used

| Aspect                                                                 | Name           |
| ---------------------------------------------------------------------- | -------------- |
| Development Language                                                   | TypeScipt      |
| Scripting Language                                                     | TypeScipt      |
| Testing                                                                | Vitest         |
| Styling                                                                | Chakra-UI      |
| Framework                                                              | NextJS         |
| Build Automation Tool                                                  | Make           |
| Text Editor                                                            | NeoVim         |
| Dependency Management                                                  | Pnpm           |
| Continuous Integration, Continuous Delivery, and Continuous Deployment | GitHub Actions |

#### Make Commands

_*Below are the non-exhaustive listed commands that you can use to build/develop/test this app. For more command, checkout [Makefile](./aakefile)*_

| Command                                                      | Usage                                             |
| ------------------------------------------------------------ | ------------------------------------------------- |
| make start-(development OR production OR testing OR staging) | Start development                                 |
| make build-(development OR production OR testing OR staging) | Bundle and build the app                          |
| make install                                                 | Install all dependencies                          |
| make test                                                    | Run all test code                                 |
| make typecheck                                               | Run typechecking for source code                  |
| make lint                                                    | Run linter for source and test code               |
| make format-check                                            | Run prettier to check source and test code format |
| make format                                                  | Run prettier to format source and test code       |
| make start-development-database                              | Start development database                        |
| make start-testing-database                                  | Start test database                               |

## Environment Variables

#### Development and Testing

Run the following command

`make copy-env-[development/testing]`

## Contribution

**Make sure you can run `make`, otherwise you need to run commands listed in `Makefile` separately**

1. Open an issue
1. Fork this repo
1. Use TypeScript
1. Write test

## Test

It's necessary to UI snapshot test, it's also a must to write test for logical processing functions
