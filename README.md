# **Git-Ignored**

An Offline-first, Unix-first CLI application that let the developer generate various `.gitignore` templates

The templates are taken from the web application [Gitignored](https://gitignored.gtsb.io/), which is the GUI application of this application, check out the [repository](https://github.com/GervinFung/gitignored) if you are interested

**Side note**:
The GUI application takes the templates from [gitignore](https://github.com/github/gitignore) of Github

Here's what the developers can do with this application

1. View the name of all available templates
2. Search to find out whether a name of a template exists
3. Preview each template(s) searched, it will include the closest template if there's typo in the name searched, i.e JetBrains for jetbrain
4. Generate template(s) to a `.gitignore` file, it will override current `.gitignore`
5. Generate template(s) to a specified directory, i.e `temp/temp1`, it will auto generate at as `temp/temp1/.gitignore`
6. Append template(s) to an existing `.gitignore` file, it will create one if it does not exist
7. Append template(s) to an existing `.gitignore` file of a specified directory, again it will create one if it does not exist
8. Update the cache to receive latest templates

You don't need to have an internet connection to use it, unless you want to update the cache

<details>
<summary>Click to preview!</summary>

#### Default Listing

![Default Listing](docs/list-default.png 'Default Listing')

#### Listing with column number specified

![Column Listing](docs/list-column.png 'Column Listing')

#### Search

![Search](docs/search.png 'Search')

#### Preview

![Preview](docs/preview.png 'Preview')

#### Default Generate

![Default Generate](docs/generate.png 'Default Generate')

#### Generate with outdir specified

![Outdir generate](docs/generate-outdir.png 'Outdir Generate')

#### Default Append

![Default Append](docs/append.png 'Default Append')

#### Append with outdir specified

![Outdir Append](docs/append-outdir.png 'Outdir Append')

#### Updated Cache

![Updated](docs/updated.png 'Updated')

#### Updating Cache

![Updating](docs/updating.png 'Updating')

#### Of course, input validation

![Input Validation](docs/input-validation.png 'Input Validation')

</details>

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

## Development

**I used localhost instead of using the url of a production-ready web application to speed up development process as the API call can be processed much quicker**

1. Clone this repo and this [repo](https://github.com/GervinFung/gitignored)
2. Refer to the commands in [Makefile](Makefile), or just refer to the command shown above

## Contribution

**Make sure you can run `make`, otherwise you need to run commands listed in `Makefile` separately**

1. Open an issue
2. Fork this repo and this [repo](https://github.com/GervinFung/gitignored)
3. Write test
