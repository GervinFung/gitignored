use colored::Colorize;

use crate::{
    cli::keywords::{assignment::Assignment, options::KeywordKind},
    types::OptionalVecString,
};

use super::OptionPairs;

#[derive(Debug, Clone)]
pub struct Update {
    keyword_kind: KeywordKind,
    assignment: Assignment,
}

#[derive(Debug, PartialEq, Eq)]
pub struct ValidUpdateTemplateResult {
    invalid_arguments: OptionalVecString,
}

impl ValidUpdateTemplateResult {
    pub fn new(invalid_arguments: OptionalVecString) -> Self {
        ValidUpdateTemplateResult { invalid_arguments }
    }
    pub fn invalid_arguments(&self) -> OptionalVecString {
        self.invalid_arguments.to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum UpdateTemplateResult {
    IsNotValid,
    IsValid(ValidUpdateTemplateResult),
}

impl Update {
    pub fn new() -> Self {
        Update {
            keyword_kind: KeywordKind::new("update"),
            assignment: Assignment::new(),
        }
    }

    pub fn keyword_kind(&self) -> &KeywordKind {
        &self.keyword_kind
    }

    fn assignment(&self) -> &Assignment {
        &self.assignment
    }

    pub fn description(&self, length: u8) -> String {
        format!(
            "{}{}- {}",
            format!("--{}", self.keyword_kind().keyword()).bold(),
            (0..(length - self.keyword_kind().keyword().len() as u8))
                .map(|_| " ")
                .collect::<Vec<_>>()
                .join(""),
            "Update the cache of gitignore templates".italic()
        )
    }

    fn keyword_same_as_argument(&self, argument: &str) -> bool {
        let assign = self.assignment().option().declaration();
        let command = assign.to_string().clone() + self.keyword_kind().keyword();

        argument == command
    }

    pub fn parse(&self, option_pairs: OptionPairs) -> UpdateTemplateResult {
        let option_pair = option_pairs
            .into_iter()
            .find(|pair| return self.keyword_same_as_argument(pair.key()))
            .map(|pair| pair.to_option_values());

        match option_pair {
            None => UpdateTemplateResult::IsNotValid,
            Some(invalid_arguments) => {
                UpdateTemplateResult::IsValid(ValidUpdateTemplateResult::new(invalid_arguments))
            }
        }
    }
}
