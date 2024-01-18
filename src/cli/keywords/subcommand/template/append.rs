use colored::Colorize;

use crate::{
    cli::keywords::{assignment::Assignment, options::KeywordKind},
    types::OptionalVecString,
    util::Str,
};

use super::OptionPairs;

#[derive(Debug, Clone)]
struct Options {
    outdir: KeywordKind,
}

impl Options {
    fn new() -> Self {
        Options {
            outdir: KeywordKind::new("outdir"),
        }
    }

    fn outdir(&self) -> &KeywordKind {
        &self.outdir
    }
}

pub type Outdir = Option<String>;

#[derive(Debug, PartialEq, Eq)]
pub struct ValidAppendTemplateResult {
    templates: OptionalVecString,
    outdir: Outdir,
    invalid_arguments: OptionalVecString,
}

impl ValidAppendTemplateResult {
    pub fn new(
        templates: OptionalVecString,
        outdir: Outdir,
        invalid_arguments: OptionalVecString,
    ) -> Self {
        ValidAppendTemplateResult {
            templates,
            outdir,
            invalid_arguments,
        }
    }

    pub fn templates(&self) -> OptionalVecString {
        self.templates.to_owned()
    }

    pub fn outdir(&self) -> Outdir {
        self.outdir.to_owned()
    }

    pub fn invalid_arguments(&self) -> OptionalVecString {
        self.invalid_arguments.to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum AppendTemplateResult {
    IsNotValid,
    IsValid(ValidAppendTemplateResult),
}

#[derive(Debug, Clone)]
pub struct Append {
    keyword_kind: KeywordKind,
    options: Options,
    assignment: Assignment,
}

impl Append {
    pub fn new() -> Self {
        Append {
            keyword_kind: KeywordKind::new("append"),
            assignment: Assignment::new(),
            options: Options::new(),
        }
    }

    pub fn description(&self, length: u8) -> String {
        let description = concat!(
            "Append the gitignore template(s) to pre-existing gitignore,",
            " ",
            "generate one if it doesn't exist"
        )
        .italic();

        let empty_by_keyword = (0..(length - self.keyword_kind().keyword().len() as u8))
            .map(|_| " ")
            .collect::<Vec<_>>()
            .join("");

        let empty = (0..(length + 2)).map(|_| " ").collect::<Vec<_>>().join("");

        format!(
            "{}{}- {}\n{}- {}\n{}    1. {} - {}",
            "--append".bold(),
            empty_by_keyword,
            description,
            empty,
            "Subcommands".bold().italic(),
            empty,
            "--outdir".bold(),
            "Output folder to store the generated gitignore file in".italic()
        )
    }

    pub fn keyword_kind(&self) -> &KeywordKind {
        &self.keyword_kind
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

    pub fn parse(&self, option_pairs: OptionPairs) -> AppendTemplateResult {
        let option = self.options();

        let result = option_pairs
            .clone()
            .into_iter()
            .find(|pair| self.keyword_same_as_argument(pair.key(), self.keyword_kind().keyword()))
            .map(|append| append.clone().value().clone())
            .map(|templates| {
                let outdir = option_pairs
                    .clone()
                    .into_iter()
                    .find(|pair| {
                        self.keyword_same_as_argument(pair.key(), option.outdir().keyword())
                    })
                    .map(|pair| pair.to_value_and_invalid_arguments());

                (templates, outdir)
            })
            .map(|(templates, outdir)| match outdir {
                None => AppendTemplateResult::IsValid(ValidAppendTemplateResult::new(
                    templates, None, None,
                )),
                Some(outdir) => {
                    let invalid_arguments = outdir.invalid_arguments();

                    AppendTemplateResult::IsValid(ValidAppendTemplateResult::new(
                        templates,
                        outdir.value(),
                        match invalid_arguments.is_empty() {
                            true => None,
                            false => Some(invalid_arguments),
                        },
                    ))
                }
            });

        match result {
            None => AppendTemplateResult::IsNotValid,
            Some(result) => result,
        }
    }
}
