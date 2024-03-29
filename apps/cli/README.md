# Gitignored

An Offline-first CLI application that let the developer generate various `.gitignore` templates

The templates are taken from the web application [Gitignored](https://gitignored.vercel.app), which is the GUI application of this application. The TUI application is available [here](https://crates.io/crates/gitignored-cli)

**Side note**:
The GUI application takes the templates from [gitignore](https://github.com/github/gitignore) of Github

Here's what the developers can do with this application

1. View the name of all available templates
2. Search to find out whether a name of a template exists
3. Preview each template(s) searched, it will include the closest template if there's typo in the name searched, i.e JetBrains for jetbrain
4. Generate template(s) to a `.gitignore` file, will not override current `.gitignore`, pass `--force` to forcefully override
5. Generate template(s) to a specified directory, i.e `temp/temp1`, it will auto generate at as `temp/temp1/.gitignore`
6. Append template(s) to an existing `.gitignore` file, it will create one if it does not exist
7. Append template(s) to an existing `.gitignore` file of a specified directory, again it will create one if it does not exist
8. Update the cache to receive latest templates
9. Uninstall and remove every cache
10. Open home page/website of this application

You don't need to have an internet connection to use it, unless you want to update the cache

**_Note: gitignored-cli is a work-in-progress library, so expect breaking changes in its API_**

# Default or Help

```sh
gitignored-cli
```

OR

```sh
gitignored-cli --help
```

![Default or Help](apps/cli/docs/default-or-help.png)

# Update Available

![Update Available](apps/cli/docs/update-available.png)

# Default Listing

```sh
gitignored-cli template --list
```

![Default Listing](apps/cli/docs/list-default.png)

# Listing with column number specified

```sh
gitignored-cli template --list --column 8
```

![Column Listing](apps/cli/docs/list-column.png)

# Search

```sh
gitignored-cli template --search rust node java vscode jetbrain whatever
```

![Search](apps/cli/docs/search.png)

# Preview

```sh
gitignored-cli template --preview rust node java vscode jetbrain
```

![Preview](apps/cli/docs/preview.png)

# Default Generate

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever
```

![Default Generate](apps/cli/docs/generate.png)
![Error Default Generate](apps/cli/docs/error-generate.png)

# Abort Generate

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever
```

![Abort Generate](apps/cli/docs/abort-generate.png)

# Force Generate

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever --force
```

![Force Generate](apps/cli/docs/force-generate.png)

# Generate with outdir specified

```sh
gitignored-cli template --generate rust node java vscode jetbrain whatever --outdir temp-dev/temp-two
```

![Outdir generate](apps/cli/docs/generate-outdir.png)

# Default Append

```sh
gitignored-cli template --append rust node java vscode jetbrain whatever
```

![Default Append](apps/cli/docs/append.png)

# Abort Append

```sh
gitignored-cli template --append rust node java vscode jetbrain whatever
```

![Abort Append](apps/cli/docs/abort-append.png)

# Append with outdir specified

```sh
gitignored-cli template --append rust node java vscode jetbrain whatever --outdir temp-dev/temp-two
```

![Outdir Append](apps/cli/docs/append-outdir.png)

# Updated Cache

```sh
gitignored-cli template --update
```

![Updated](apps/cli/docs/updated.png)

# Updating Cache

```sh
gitignored-cli template --update
```

![Updating](apps/cli/docs/updating.png)

# Open home page in browser

```sh
gitignored-cli open-link
```

![Open Link](apps/cli/docs/open-link.png)

# Uninstall

```sh
gitignored-cli uninstall
```

![Uninstall](apps/cli/docs/uninstall.png)

# Of course, input validation

![Input Validation](apps/cli/docs/input-validation.png)

# How To Use

Install it

```sh
cargo install gitignored-cli
```

Run it

```sh
gitignored-cli (commands)
```

### Tech Used

| Aspect                 | Name           |
| ---------------------- | -------------- |
| Language               | Rust           |
| Linting                | Clippy         |
| Format                 | Rustfmt        |
| Build Automation Tool  | Make           |
| Package Manager        | Cargo          |
| Continuous Integration | GitHub Actions |

### Make Commands

_*Below are the listed commands that you can use to build/develop/test this app*_

| Command        | Usage                                           |
| -------------- | ----------------------------------------------- |
| make test-dev  | Run all test code in development environment    |
| make test-prod | Run all test code in ci-cd                      |
| make build     | Bundle, build and release the app as executable |
| make check     | Run compiler checking on code                   |
| make lint      | Run linter for code                             |
| make format    | Run formatter to format the code                |

### Contribution

**Make sure you can run `make`, otherwise you need to run commands listed in `Makefile` separately**

1. Open an issue
2. Fork this repo
3. Write test

### Changes

Refer to [here](apps/cli/CHANGELOG.md)
