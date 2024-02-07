# **Git-Ignored**

An Offline-first CLI application that let the developer generate various `.gitignore` templates

The templates are taken from the web application [Gitignored](https://gitignored.vercel.app), which is the GUI application of this application, check out the [repository](https://github.com/GervinFung/gitignored) if you are interested

**Side note**:
The GUI application takes the templates from [gitignore](https://github.com/github/gitignore) of Github

You don't need to have an internet connection to use it, unless you want to update the cache

**_Note: gitignored-cli is a work-in-progress library, so expect breaking changes in its API_**

#### Default or Help

```sh
gitignored-cli
```

OR

```sh
gitignored-cli --help
```

![Default or Help](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/default-or-help.png)

#### Update Available

![Update Available](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/update-available.png)

#### Default Listing

```sh
gitignored-cli template --list
```

![Default Listing](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/list-default.png)

#### Listing with column number specified

```sh
gitignored-cli template --list --column 8
```

![Column Listing](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/list-column.png)

#### Search

```sh
gitignored-cli template --search rust node java vscode jetbrain whatever
```

![Search](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/search.png)

#### Preview

```sh
gitignored-cli template --preview rust node java vscode jetbrain
```

![Preview](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/preview.png)

#### Default Generate

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever
```

![Default Generate](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/generate.png)
![Error Default Generate](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/error-generate.png)

#### Abort Generate

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever
```

![Abort Generate](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/abort-generate.png)

#### Force Generate

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever --force
```

![Force Generate](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/force-generate.png)

#### Generate with outdir specified

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever --outdir temp-dev/temp-two
```

![Outdir generate](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/generate-outdir.png)

#### Default Append

```sh
gitignored-cli template --append rust node java vscode jetbrain whatever
```

![Default Append](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/append.png)

#### Abort Append

```sh
gitignored-cli template --append rust node java vscode jetbrain whatever
```

![Abort Append](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/abort-append.png)

```sh
gitignored-cli template --append rust node java vscode jetbrain whatever --outdir temp-dev/temp-two
```

![Outdir Append](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/append-outdir.png)

#### Updated Cache

```sh
gitignored-cli template --update
```

![Updated](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/updated.png)

#### Updating Cache

```sh
gitignored-cli template --update
```

![Updating](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/updating.png)

```sh
gitignored-cli template --update
```

![Open Link](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/open-link.png)

#### Of course, input validation

![Input Validation](https://github.com/GervinFung/gitignored/blob/main/apps/cli/docs/input-validation.png)

## How To Use

Install it

```sh
cargo install gitignored-cli
```

Run it

```sh
gitignored-cli (commands)
```

## Tech Used

| Aspect                                                                 | Name           |
| ---------------------------------------------------------------------- | -------------- |
| Language                                                               | Rust           |
| Linting                                                                | Clippy         |
| Format                                                                 | Rustfmt        |
| Build Automation Tool                                                  | Make           |
| Text Editor                                                            | NeoVim         |
| Package Manager                                                        | Cargo          |
| Continuous Integration, Continuous Delivery, and Continuous Deployment | GitHub Actions |

## Make Commands

_*Below are the listed commands that you can use to build/develop/test this app*_

| Command        | Usage                                           |
| -------------- | ----------------------------------------------- |
| make test-dev  | Run all test code in development environment    |
| make test-prod | Run all test code in ci-cd                      |
| make build     | Bundle, build and release the app as executable |
| make check     | Run compiler checking on code                   |
| make lint      | Run linter for code                             |
| make format    | Run formatter to format the code                |

## Contribution

**Make sure you can run `make`, otherwise you need to run commands listed in `Makefile` separately**

1. Open an issue
2. Fork this repo
3. Write test

## Changes

Refer to [here](https://github.com/GervinFung/gitignored/blob/update-docs/apps/cli/CHANGELOG.md)
