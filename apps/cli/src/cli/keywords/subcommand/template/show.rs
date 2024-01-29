use colored::Colorize;

use crate::{
    cli::keywords::{assignment::Assignment, options::KeywordKind},
    types::OptionalVecString,
};

use super::OptionPairs;

#[derive(Debug, Clone)]
pub struct Show {
    keyword_kind: KeywordKind,
    default_value: u8,
    assignment: Assignment,
}

#[derive(Debug, PartialEq, Eq)]
pub struct ValidShowTemplateResult {
    column: u8,
    invalid_arguments: OptionalVecString,
}

impl ValidShowTemplateResult {
    pub fn new(column: u8, invalid_arguments: OptionalVecString) -> Self {
        ValidShowTemplateResult {
            column,
            invalid_arguments,
        }
    }

    pub fn column(&self) -> u8 {
        self.column.to_owned()
    }

    pub fn invalid_arguments(&self) -> OptionalVecString {
        self.invalid_arguments.to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum ShowTemplateResult {
    IsNotValid,
    IsValid(ValidShowTemplateResult),
}

impl Show {
    pub fn new() -> Self {
        Show {
            keyword_kind: KeywordKind::new("show"),
            default_value: 8,
            assignment: Assignment::new(),
        }
    }

    pub fn description(&self, length: u8) -> String {
        let description =
            "Show all the name of the available Frameworks or Languages or IDEs or Tech".italic();

        let empty_by_keyword = (0..(length - self.keyword_kind().keyword().len() as u8))
            .map(|_| " ")
            .collect::<Vec<_>>()
            .join("");

        let empty = (0..(length + 2)).map(|_| " ").collect::<Vec<_>>().join("");

        format!(
            "{}{}- {}\n{}- {}\n{}    1. {} - {}",
            "--show".bold(),
            empty_by_keyword,
            description,
            empty,
            "Subcommands".bold().italic(),
            empty,
            "--column".bold(),
            "Set the the number of columns for the tabular output".italic(),
        )
    }

    pub fn keyword_kind(&self) -> &KeywordKind {
        &self.keyword_kind
    }

    fn input(&self) -> u8 {
        self.default_value
    }

    fn assignment(&self) -> &Assignment {
        &self.assignment
    }

    fn keyword_same_as_argument(&self, argument: &str) -> bool {
        let assign = self.assignment().option().declaration();
        let command = assign.to_string().clone() + self.keyword_kind().keyword();

        argument == command
    }

    pub fn parse(&self, option_pairs: OptionPairs) -> ShowTemplateResult {
        let option_pair = option_pairs
            .into_iter()
            .find(|pair| return self.keyword_same_as_argument(pair.key()))
            .map(|pair| pair.to_value_and_arguments());

        match option_pair {
            None => ShowTemplateResult::IsNotValid,
            Some(option_pair) => {
                let value = option_pair.value();

                match value {
                    None => ShowTemplateResult::IsValid(ValidShowTemplateResult::new(
                        self.input(),
                        None,
                    )),
                    Some(value) => {
                        let column = value.parse::<u8>();

                        let arguments = match column.is_ok() {
                            true => option_pair.arguments(),
                            false => [value]
                                .into_iter()
                                .chain(option_pair.arguments())
                                .collect::<Vec<_>>(),
                        };

                        let column = column.unwrap_or(self.input());

                        ShowTemplateResult::IsValid(ValidShowTemplateResult::new(
                            column,
                            match arguments.is_empty() {
                                true => None,
                                false => Some(arguments),
                            },
                        ))
                    }
                }
            }
        }
    }
}
