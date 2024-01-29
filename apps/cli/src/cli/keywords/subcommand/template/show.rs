use colored::Colorize;

use crate::{
    cli::keywords::{assignment::Assignment, options::KeywordKind},
    types::{OptionalVecString, Str},
};

use super::OptionPairs;

#[derive(Debug, Clone)]
struct Options {
    column: KeywordKind,
}

impl Options {
    fn new() -> Self {
        Options {
            column: KeywordKind::new("column"),
        }
    }

    fn column(&self) -> &KeywordKind {
        &self.column
    }
}

#[derive(Debug, Clone)]
pub struct List {
    keyword_kind: KeywordKind,
    default_value: u8,
    assignment: Assignment,
    options: Options,
}

#[derive(Debug, PartialEq, Eq)]
pub struct ValidListTemplateResult {
    column: u8,
    invalid_arguments: OptionalVecString,
}

impl ValidListTemplateResult {
    pub fn new(column: u8, invalid_arguments: OptionalVecString) -> Self {
        ValidListTemplateResult {
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
pub enum ListTemplateResult {
    IsNotValid,
    IsValid(ValidListTemplateResult),
}

impl List {
    pub fn new() -> Self {
        List {
            keyword_kind: KeywordKind::new("show"),
            default_value: 4,
            assignment: Assignment::new(),
            options: Options::new(),
        }
    }

    pub fn description(&self, length: u8) -> String {
        let description =
            "List all the name of the available Frameworks or Languages or IDEs or Tech".italic();

        let empty_by_keyword = (0..(length - self.keyword_kind().keyword().len() as u8))
            .map(|_| " ")
            .collect::<Vec<_>>()
            .join("");

        let empty = (0..(length + 2)).map(|_| " ").collect::<Vec<_>>().join("");

        format!(
            "{}{}- {}\n{}- {}\n{}    1. {} - {}",
            "--list".bold(),
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

    fn options(&self) -> &Options {
        &self.options
    }

    fn assignment(&self) -> &Assignment {
        &self.assignment
    }

    fn keyword_same_as_argument(&self, argument: &str, keyword: Str) -> bool {
        let assign = self.assignment().option().declaration();
        let command = assign.to_string().clone() + keyword;

        argument == command
    }

    pub fn parse(&self, option_pairs: OptionPairs) -> ListTemplateResult {
        let result = option_pairs
            .clone()
            .into_iter()
            .find(|pair| self.keyword_same_as_argument(pair.key(), self.keyword_kind().keyword()))
            .map(|show| show.clone().value().clone())
            .map(|show| {
                let column = option_pairs
                    .into_iter()
                    .find(|pair| {
                        self.keyword_same_as_argument(pair.key(), self.options().column().keyword())
                    })
                    .map(|pair| pair.to_value_and_invalid_arguments());

                (show, column)
            })
            .map(|(show_invalid_arguments, column)| {
                let invalid_arguments = show_invalid_arguments.unwrap_or(vec![]);

                match column {
                    None => ListTemplateResult::IsValid(ValidListTemplateResult::new(
                        self.input(),
                        match invalid_arguments.is_empty() {
                            true => None,
                            false => Some(invalid_arguments),
                        },
                    )),
                    Some(column_pair) => {
                        let invalid_arguments = column_pair
                            .invalid_arguments()
                            .into_iter()
                            .chain(invalid_arguments)
                            .collect::<Vec<_>>();

                        match column_pair.value() {
                            None => ListTemplateResult::IsValid(ValidListTemplateResult::new(
                                self.input(),
                                match invalid_arguments.is_empty() {
                                    true => None,
                                    false => Some(invalid_arguments),
                                },
                            )),
                            Some(value) => {
                                let column = value.parse::<u8>();

                                let invalid_arguments = match column.is_ok() {
                                    true => invalid_arguments,
                                    false => [value]
                                        .into_iter()
                                        .chain(invalid_arguments)
                                        .collect::<Vec<_>>(),
                                };

                                ListTemplateResult::IsValid(ValidListTemplateResult::new(
                                    column.unwrap_or(self.input()),
                                    match invalid_arguments.is_empty() {
                                        true => None,
                                        false => Some(invalid_arguments),
                                    },
                                ))
                            }
                        }
                    }
                }
            });

        result.unwrap_or(ListTemplateResult::IsNotValid)
    }
}
