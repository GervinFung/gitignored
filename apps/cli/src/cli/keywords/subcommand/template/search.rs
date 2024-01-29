use colored::Colorize;

use crate::{
    cli::keywords::{assignment::Assignment, options::KeywordKind},
    types::OptionalVecString,
};

use super::OptionPairs;

#[derive(Debug, Clone)]
pub struct Search {
    keyword_kind: KeywordKind,
    assignment: Assignment,
}

#[derive(Debug, PartialEq, Eq)]
pub struct ValidSearchTemplateResult {
    templates: OptionalVecString,
}

impl ValidSearchTemplateResult {
    pub fn new(templates: OptionalVecString) -> Self {
        ValidSearchTemplateResult { templates }
    }

    pub fn templates(&self) -> OptionalVecString {
        self.templates.to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum SearchTemplateResult {
    IsNotValid,
    IsValid(ValidSearchTemplateResult),
}

impl Search {
    pub fn new() -> Self {
        Search {
            keyword_kind: KeywordKind::new("search"),
            assignment: Assignment::new(),
        }
    }

    pub fn description(&self, length: u8) -> String {
        let description = concat!(
            "Search for the name of the Frameworks or Languages or IDEs or Tech.",
            " ",
            "Will provide the closest match if there's no match"
        )
        .italic();

        format!(
            "{}{}- {}",
            "--search".bold(),
            (0..(length - self.keyword_kind().keyword().len() as u8))
                .map(|_| " ")
                .collect::<Vec<_>>()
                .join(""),
            description,
        )
    }

    pub fn keyword_kind(&self) -> &KeywordKind {
        &self.keyword_kind
    }

    fn assignment(&self) -> &Assignment {
        &self.assignment
    }

    fn keyword_same_as_argument(&self, argument: &str) -> bool {
        let assign = self.assignment().option().declaration();
        let command = assign.to_string().clone() + self.keyword_kind().keyword();

        argument == command
    }

    pub fn parse(&self, option_pairs: OptionPairs) -> SearchTemplateResult {
        let option_pair = option_pairs
            .into_iter()
            .find(|pair| self.keyword_same_as_argument(pair.key()))
            .map(|pair| pair.to_option_values());

        match option_pair {
            None => SearchTemplateResult::IsNotValid,
            Some(templates) => {
                SearchTemplateResult::IsValid(ValidSearchTemplateResult::new(templates))
            }
        }
    }
}
