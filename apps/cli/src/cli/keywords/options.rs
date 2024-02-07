use colored::Colorize;

use crate::{
    env::Env,
    types::{OptionalVecString, Str},
};

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

impl OptionsResult {
    pub fn map<Function>(self, function: Function) -> Self
    where
        Function: FnOnce(ValidOptionsResult) -> OptionsResult,
    {
        match self {
            OptionsResult::IsNotValid => OptionsResult::IsNotValid,
            OptionsResult::IsValid(result) => function(result),
        }
    }
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

    pub fn description(&self, length: u8) -> String {
        format!(
            "{}{}- {}",
            format!("--{}", self.keyword_kind().keyword()).bold(),
            (0..(length - self.keyword_kind().keyword().len() as u8))
                .map(|_| " ")
                .collect::<Vec<_>>()
                .join(""),
            "Display current guides".italic()
        )
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

    pub fn description(&self, length: u8) -> String {
        format!(
            "{}{}- {}",
            format!("--{}", self.keyword_kind().keyword()).bold(),
            (0..(length - self.keyword_kind().keyword().len() as u8))
                .map(|_| " ")
                .collect::<Vec<_>>()
                .join(""),
            "Display the current version of gitignored-cli installed".italic()
        )
    }
}

#[derive(Debug, Clone)]
pub struct OpenLink {
    keyword_kind: KeywordKind,
}

impl OpenLink {
    pub const fn new() -> Self {
        OpenLink {
            keyword_kind: KeywordKind::new("open-link"),
        }
    }

    pub fn keyword_kind(&self) -> &KeywordKind {
        &self.keyword_kind
    }

    pub fn description(&self, length: u8) -> String {
        format!(
            "{}{}- {}",
            format!("--{}", self.keyword_kind().keyword()).bold(),
            (0..(length - self.keyword_kind().keyword().len() as u8))
                .map(|_| " ")
                .collect::<Vec<_>>()
                .join(""),
            "Open the home page of gitignored in default browser".italic()
        )
    }
}

#[derive(Debug, PartialEq)]
pub enum OptionsResultKind {
    Help(ValidOptionsResult),
    Version(ValidOptionsResult),
    OpenLink(ValidOptionsResult),
    Never,
}

#[derive(Debug)]
pub struct Options {
    assignment: Assignment,
    help: Help,
    version: Version,
    open_link: OpenLink,
}

impl Options {
    pub fn new() -> Self {
        Options {
            assignment: Assignment::new(),
            help: Help::new(),
            version: Version::new(),
            open_link: OpenLink::new(),
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

    fn open_link(&self) -> &OpenLink {
        &self.open_link
    }

    fn length_of_longest_keyword(&self) -> u8 {
        [
            self.version().keyword_kind(),
            self.help().keyword_kind(),
            self.open_link().keyword_kind(),
        ]
        .into_iter()
        .map(|kind| kind.keyword())
        .map(|keyword| keyword.len() as u8)
        .max()
        .map(|length| length + 1)
        .unwrap()
    }

    pub fn description(&self) -> String {
        let length = self.length_of_longest_keyword();

        let version = self.version().description(length);
        let help = self.help().description(length);
        let open_link = self.open_link().description(length);

        format!(
            "{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n",
            "Arguments Usage".bright_yellow(),
            "1. gitignored (arguments)".bold(),
            version,
            help,
            open_link,
        )
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
                _ => result.map(|result| match result.invalid_arguments() {
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
                }),
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

    fn parse_open_link(&self, text: String) -> OptionsResult {
        let url = Env::API.replace("/api/v0", "");

        match text.is_empty() {
            true => OptionsResult::IsNotValid,
            false => self.parse(text, self.open_link().keyword_kind().keyword(), url),
        }
    }

    pub fn parse_to_result(&self, text: String, help_value: String) -> OptionsResultKind {
        let help = self.parse_help(text.to_owned(), help_value);

        match help {
            OptionsResult::IsValid(result) => OptionsResultKind::Help(result),
            OptionsResult::IsNotValid => {
                let version = self.parse_version(text.to_owned());

                match version {
                    OptionsResult::IsValid(result) => OptionsResultKind::Version(result),
                    OptionsResult::IsNotValid => {
                        let open_link = self.parse_open_link(text.to_owned());

                        match open_link {
                            OptionsResult::IsValid(result) => OptionsResultKind::OpenLink(result),
                            OptionsResult::IsNotValid => OptionsResultKind::Never,
                        }
                    }
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
    fn it_should_parse_open_link() {
        let option = Options::new();

        let url = Env::API.replace("/api/v0", "");

        let result = option.parse_open_link("--open-link".to_string());

        assert_eq!(
            result,
            OptionsResult::IsValid(ValidOptionsResult::new(url.clone(), None))
        );

        let result = option.parse_open_link("--open-link this is all invalid".to_string());

        assert_eq!(
            result,
            OptionsResult::IsValid(ValidOptionsResult::new(
                url,
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
