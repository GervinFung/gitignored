use colored::Colorize;

use crate::{
    env::Env,
    types::{OptionalVecString, Str},
    util::Util,
};

use self::{openlink::OpenLink, uninstall::Uninstall};

use super::assignment::Assignment;

pub mod openlink;
pub mod uninstall;

#[derive(Clone, Debug, PartialEq)]
pub struct ValidCommandResult {
    value: Option<String>,
    invalid_arguments: OptionalVecString,
}

impl ValidCommandResult {
    pub fn new(value: Option<String>, invalid_arguments: OptionalVecString) -> Self {
        ValidCommandResult {
            value,
            invalid_arguments,
        }
    }

    pub fn value(&self) -> Option<String> {
        self.value.to_owned()
    }

    pub fn invalid_arguments(&self) -> OptionalVecString {
        self.invalid_arguments.to_owned()
    }
}

#[derive(Debug, PartialEq)]
pub enum CommandResult {
    IsNotValid,
    IsValid(ValidCommandResult),
}

impl CommandResult {
    pub fn map<Function>(self, function: Function) -> Self
    where
        Function: FnOnce(ValidCommandResult) -> CommandResult,
    {
        match self {
            CommandResult::IsNotValid => CommandResult::IsNotValid,
            CommandResult::IsValid(result) => function(result),
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum CommandResultKind {
    Uninstall(ValidCommandResult),
    OpenLink(ValidCommandResult),
    Never,
}

#[derive(Debug, Clone)]
pub struct Command {
    assignment: Assignment,
    uninstall: Uninstall,
    open_link: OpenLink,
}

impl Command {
    pub fn new() -> Self {
        Command {
            assignment: Assignment::new(),
            uninstall: Uninstall::new(),
            open_link: OpenLink::new(),
        }
    }

    fn uninstall(&self) -> &Uninstall {
        &self.uninstall
    }

    fn open_link(&self) -> &OpenLink {
        &self.open_link
    }

    fn assignment(&self) -> &Assignment {
        &self.assignment
    }

    fn parse(&self, text: String, keyword: Str, value: Option<String>) -> CommandResult {
        let arguments = text.split(self.assignment().assign().space());

        arguments.clone().enumerate().fold(
            CommandResult::IsNotValid,
            |result, (index, argument)| match index {
                0 => {
                    let both_diff = argument == keyword;

                    match both_diff {
                        false => CommandResult::IsNotValid,
                        true => {
                            CommandResult::IsValid(ValidCommandResult::new(value.clone(), None))
                        }
                    }
                }
                _ => result.map(|result| match result.invalid_arguments() {
                    None => CommandResult::IsValid(ValidCommandResult::new(
                        value.clone(),
                        Some(vec![argument.to_string()]),
                    )),
                    Some(invalid_arguments) => CommandResult::IsValid(ValidCommandResult::new(
                        value.clone(),
                        Some(
                            invalid_arguments
                                .into_iter()
                                .chain([argument.to_string()])
                                .collect::<Vec<_>>(),
                        ),
                    )),
                }),
            },
        )
    }

    fn parse_uninstall(&self, text: String) -> CommandResult {
        match text.is_empty() {
            true => CommandResult::IsNotValid,
            false => self.parse(text, self.uninstall().keyword_kind().keyword(), None),
        }
    }

    fn parse_open_link(&self, text: String) -> CommandResult {
        let url = Env::API.replace("/api/v0", "");

        match text.is_empty() {
            true => CommandResult::IsNotValid,
            false => self.parse(text, self.open_link().keyword_kind().keyword(), Some(url)),
        }
    }

    pub fn parse_to_result(&self, text: String) -> CommandResultKind {
        let link = self.parse_open_link(text.to_owned());

        match link {
            CommandResult::IsValid(result) => CommandResultKind::OpenLink(result),
            CommandResult::IsNotValid => {
                let uninstall = self.parse_uninstall(text.to_owned());

                match uninstall {
                    CommandResult::IsNotValid => CommandResultKind::Never,
                    CommandResult::IsValid(result) => CommandResultKind::Uninstall(result),
                }
            }
        }
    }

    pub fn description(&self) -> String {
        let length = Util::new().string().length_of_longest_keyword(vec![
            self.open_link().keyword_kind().clone(),
            self.uninstall().keyword_kind().clone(),
        ]);

        let open_link = self.open_link().description(length);
        let uninstall = self.uninstall().description(length);

        format!(
            "{}\n\n{}\n\n{}\n\n{}\n",
            "Command Usage".bright_yellow(),
            "1. gitignored (arguments)".bold(),
            open_link,
            uninstall,
        )
    }
}

#[cfg(test)]
mod tests {
    use crate::{cli::keywords::command::CommandResultKind, env::Env};

    use super::{Command, CommandResult, ValidCommandResult};

    #[test]
    fn it_should_parse_open_link() {
        let option = Command::new();

        let url = Some(Env::API.replace("/api/v0", ""));

        let result = option.parse_open_link("open-link".to_string());

        assert_eq!(
            result,
            CommandResult::IsValid(ValidCommandResult::new(url.clone(), None))
        );

        let result = option.parse_open_link("open-link this is all invalid".to_string());

        assert_eq!(
            result,
            CommandResult::IsValid(ValidCommandResult::new(
                url,
                Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "all".to_string(),
                    "invalid".to_string(),
                ])
            ))
        );

        let result = option.parse_open_link("this is also invalid open-link".to_string());

        assert_eq!(result, CommandResult::IsNotValid);
    }

    #[test]
    fn it_should_parse_uninstall() {
        let option = Command::new();

        let result = option.parse_uninstall("uninstall".to_string());

        assert_eq!(
            result,
            CommandResult::IsValid(ValidCommandResult::new(None, None))
        );

        let result = option.parse_uninstall("uninstall this is all invalid".to_string());

        assert_eq!(
            result,
            CommandResult::IsValid(ValidCommandResult::new(
                None,
                Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "all".to_string(),
                    "invalid".to_string(),
                ])
            ))
        );

        let result = option.parse_uninstall("this is also invalid uninstall".to_string());

        assert_eq!(result, CommandResult::IsNotValid);
    }

    #[test]
    fn it_should_parse_to_result() {
        let url = Some(Env::API.replace("/api/v0", ""));

        let option = Command::new();

        let result = option.parse_to_result("open-link".to_string());

        assert_eq!(
            result,
            CommandResultKind::OpenLink(ValidCommandResult::new(url, None))
        );

        let result = option.parse_to_result("uninstall".to_string());

        assert_eq!(
            result,
            CommandResultKind::Uninstall(ValidCommandResult::new(None, None))
        );
    }
}
