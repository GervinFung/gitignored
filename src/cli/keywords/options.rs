use crate::{env::Env, types::OptionalVecString, util::Str};

use super::assignment::Assignment;

#[derive(Debug, PartialEq)]
pub struct ValidOptionsResult {
    value: String,
    invalid_arguments: OptionalVecString,
}

impl ValidOptionsResult {
    pub fn new(value: String, invalid_arguments: OptionalVecString) -> Self {
        ValidOptionsResult {
            value,
            invalid_arguments,
        }
    }

    pub fn invalid_arguments(&self) -> OptionalVecString {
        self.invalid_arguments.to_owned()
    }

    pub fn value(&self) -> String {
        self.value.to_owned()
    }
}

#[derive(Debug, PartialEq)]
pub enum OptionsResult {
    IsNotValid,
    IsValid(ValidOptionsResult),
}

#[derive(Debug, Clone)]
pub struct KeywordKind {
    keyword: Str,
}

impl KeywordKind {
    pub const fn new(keyword: Str) -> Self {
        KeywordKind { keyword }
    }

    pub fn keyword(&self) -> Str {
        self.keyword
    }
}

#[derive(Debug, Clone)]
pub struct Help {
    keyword_kind: KeywordKind,
}

impl Help {
    pub const fn new() -> Self {
        Help {
            keyword_kind: KeywordKind::new("help"),
        }
    }

    pub fn keyword_kind(&self) -> &KeywordKind {
        &self.keyword_kind
    }
}

#[derive(Debug, Clone)]
pub struct Version {
    keyword_kind: KeywordKind,
}

impl Version {
    pub const fn new() -> Self {
        Version {
            keyword_kind: KeywordKind::new("version"),
        }
    }

    pub fn keyword_kind(&self) -> &KeywordKind {
        &self.keyword_kind
    }
}

#[derive(Debug, PartialEq)]
pub enum OptionsResultKind {
    Help(ValidOptionsResult),
    Version(ValidOptionsResult),
    Never,
}

#[derive(Debug)]
pub struct Options {
    assignment: Assignment,
    help: Help,
    version: Version,
}

impl Options {
    pub fn new() -> Self {
        Options {
            assignment: Assignment::new(),
            help: Help::new(),
            version: Version::new(),
        }
    }

    fn assignment(&self) -> &Assignment {
        &self.assignment
    }

    fn help(&self) -> &Help {
        &self.help
    }

    fn version(&self) -> &Version {
        &self.version
    }

    fn keyword_diff_from_argument(&self, argument: &str, keyword: Str) -> bool {
        let assign = self.assignment().option().declaration();
        let command = assign.to_string().clone() + keyword;

        argument == command
    }

    fn parse(&self, text: String, keyword: Str, value: String) -> OptionsResult {
        let arguments = text.split(self.assignment().assign().space());

        arguments.clone().enumerate().fold(
            OptionsResult::IsNotValid,
            |result, (index, argument)| match index {
                0 => {
                    let both_diff = self.keyword_diff_from_argument(argument, keyword);

                    match both_diff {
                        false => OptionsResult::IsNotValid,
                        true => OptionsResult::IsValid(ValidOptionsResult::new(
                            value.to_owned(),
                            Option::None,
                        )),
                    }
                }
                _ => match result {
                    OptionsResult::IsNotValid => OptionsResult::IsNotValid,
                    OptionsResult::IsValid(result) => match result.invalid_arguments() {
                        None => OptionsResult::IsValid(ValidOptionsResult::new(
                            value.to_owned(),
                            Option::Some(vec![argument.to_string()]),
                        )),
                        Some(invalid_arguments) => OptionsResult::IsValid(ValidOptionsResult::new(
                            value.to_owned(),
                            Option::Some(
                                invalid_arguments
                                    .into_iter()
                                    .chain(vec![argument.to_string()])
                                    .collect::<Vec<_>>(),
                            ),
                        )),
                    },
                },
            },
        )
    }

    fn parse_help(&self, text: String, value: String) -> OptionsResult {
        match text.is_empty() {
            true => OptionsResult::IsValid(ValidOptionsResult::new(value, None)),
            false => self.parse(text, self.help().keyword_kind().keyword(), value),
        }
    }

    fn parse_version(&self, text: String) -> OptionsResult {
        let version = Env::VERSION.to_string();

        match text.is_empty() {
            true => OptionsResult::IsNotValid,
            false => self.parse(text, self.version().keyword_kind().keyword(), version),
        }
    }

    pub fn parse_to_result(&self, text: String, help_value: String) -> OptionsResultKind {
        let help = self.parse_help(text.to_owned(), help_value);

        match help {
            OptionsResult::IsValid(result) => OptionsResultKind::Help(result),
            OptionsResult::IsNotValid => {
                let version = self.parse_version(text.to_owned());

                match version {
                    OptionsResult::IsNotValid => OptionsResultKind::Never,
                    OptionsResult::IsValid(result) => OptionsResultKind::Version(result),
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        cli::keywords::options::{OptionsResultKind, ValidOptionsResult},
        env::Env,
    };

    use super::{Options, OptionsResult};

    #[test]
    fn it_should_parse_help() {
        let option = Options::new();

        let result = option.parse_help("".to_string(), "help".to_string());

        assert_eq!(
            result,
            OptionsResult::IsValid(ValidOptionsResult::new("help".to_string(), None))
        );

        let result = option.parse_help("--help".to_string(), "help".to_string());

        assert_eq!(
            result,
            OptionsResult::IsValid(ValidOptionsResult::new("help".to_string(), None))
        );

        let result =
            option.parse_help("--help this is all invalid".to_string(), "help".to_string());

        assert_eq!(
            result,
            OptionsResult::IsValid(ValidOptionsResult::new(
                "help".to_string(),
                Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "all".to_string(),
                    "invalid".to_string(),
                ])
            ))
        );

        let result = option.parse_help(
            "this is also invalid --help".to_string(),
            "help".to_string(),
        );

        assert_eq!(result, OptionsResult::IsNotValid);
    }

    #[test]
    fn it_should_parse_version() {
        let option = Options::new();

        let version = Env::VERSION;

        let result = option.parse_version("--version".to_string());

        assert_eq!(
            result,
            OptionsResult::IsValid(ValidOptionsResult::new(version.to_string(), None))
        );

        let result = option.parse_version("--version this is all invalid".to_string());

        assert_eq!(
            result,
            OptionsResult::IsValid(ValidOptionsResult::new(
                version.to_string(),
                Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "all".to_string(),
                    "invalid".to_string(),
                ])
            ))
        );

        let result = option.parse_version("this is also invalid --version".to_string());

        assert_eq!(result, OptionsResult::IsNotValid);
    }

    #[test]
    fn it_should_parse_to_result() {
        let option = Options::new();

        let result = option.parse_to_result("".to_string(), "help".to_string());

        assert_eq!(
            result,
            OptionsResultKind::Help(ValidOptionsResult::new("help".to_string(), None))
        );

        let result = option.parse_to_result("--version".to_string(), "help".to_string());

        assert_eq!(
            result,
            OptionsResultKind::Version(ValidOptionsResult::new(Env::VERSION.to_string(), None))
        );
    }
}
