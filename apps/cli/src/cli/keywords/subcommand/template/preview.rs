use colored::Colorize;

use crate::{
    cli::keywords::{assignment::Assignment, options::KeywordKind},
    types::OptionalVecString,
};

use super::OptionPairs;

#[derive(Debug, Clone)]
pub struct Preview {
    keyword_kind: KeywordKind,
    assignment: Assignment,
}

#[derive(Debug, PartialEq, Eq)]
pub struct ValidPreviewTemplateResult {
    templates: OptionalVecString,
}

impl ValidPreviewTemplateResult {
    pub fn new(templates: OptionalVecString) -> Self {
        ValidPreviewTemplateResult { templates }
    }

    pub fn templates(&self) -> OptionalVecString {
        self.templates.to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum PreviewTemplateResult {
    IsNotValid,
    IsValid(ValidPreviewTemplateResult),
}

impl Preview {
    pub fn new() -> Self {
        Preview {
            keyword_kind: KeywordKind::new("preview"),
            assignment: Assignment::new(),
        }
    }

    pub fn description(&self, length: u8) -> String {
        format!(
            "{}{}- {}",
            format!("--{}", self.keyword_kind().keyword()).bold(),
            (0..(length - self.keyword_kind().keyword().len() as u8))
                .map(|_| " ")
                .collect::<Vec<_>>()
                .join(""),
            "Preview chosen gitignore template, ie, for i.e Rust, Java, Yeoman".italic(),
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

    pub fn parse(&self, option_pairs: OptionPairs) -> PreviewTemplateResult {
        let option_pair = option_pairs
            .into_iter()
            .find(|pair| self.keyword_same_as_argument(pair.key()))
            .map(|pair| pair.to_option_values());

        match option_pair {
            None => PreviewTemplateResult::IsNotValid,
            Some(templates) => {
                PreviewTemplateResult::IsValid(ValidPreviewTemplateResult::new(templates))
            }
        }
    }
}
