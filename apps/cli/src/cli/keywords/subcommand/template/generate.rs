use colored::Colorize;

use crate::{
    cli::keywords::{assignment::Assignment, options::KeywordKind},
    types::{OptionalVecString, Str},
};

use super::{append::Outdir, OptionPairs};

#[derive(Debug, Clone)]
struct Options {
    force: KeywordKind,
    outdir: KeywordKind,
}

impl Options {
    fn new() -> Self {
        Options {
            force: KeywordKind::new("force"),
            outdir: KeywordKind::new("outdir"),
        }
    }

    fn force(&self) -> &KeywordKind {
        &self.force
    }

    fn outdir(&self) -> &KeywordKind {
        &self.outdir
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct ValidGenerateTemplateResult {
    templates: OptionalVecString,
    force: bool,
    outdir: Outdir,
    invalid_arguments: OptionalVecString,
}

impl ValidGenerateTemplateResult {
    pub fn new(
        templates: OptionalVecString,
        force: bool,
        outdir: Outdir,
        invalid_arguments: OptionalVecString,
    ) -> Self {
        ValidGenerateTemplateResult {
            templates,
            force,
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

    pub fn force(&self) -> bool {
        self.force.to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub enum GenerateTemplateResult {
    IsNotValid,
    IsValid(ValidGenerateTemplateResult),
}

#[derive(Debug, Clone)]
pub struct Generate {
    keyword_kind: KeywordKind,
    options: Options,
    assignment: Assignment,
}

impl Generate {
    pub fn new() -> Self {
        Generate {
            keyword_kind: KeywordKind::new("generate"),
            assignment: Assignment::new(),
            options: Options::new(),
        }
    }

    pub fn description(&self, length: u8) -> String {
        let description = concat!(
            "Generate the gitignore template(s) for i.e Rust, TypeScript, Intellij etc",
            " ",
            "It will not override any current gitignore by default"
        )
        .italic();

        let empty_by_keyword = (0..(length - self.keyword_kind().keyword().len() as u8))
            .map(|_| " ")
            .collect::<Vec<_>>()
            .join("");

        let empty = (0..(length + 2)).map(|_| " ").collect::<Vec<_>>().join("");

        format!(
            "{}{}- {}\n{}- {}\n{}    1. {} - {}\n{}    2. {} - {}",
            "--generate".bold(),
            empty_by_keyword,
            description,
            empty,
            "Subcommands".bold().italic(),
            empty,
            "--outdir".bold(),
            "Output folder to store the generated gitignore file in specified directory".italic(),
            empty,
            "--force".bold(),
            "Forcefully override any current gitignore".italic()
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

    pub fn parse(&self, option_pairs: OptionPairs) -> GenerateTemplateResult {
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
                        self.keyword_same_as_argument(pair.key(), self.options().outdir().keyword())
                    })
                    .map(|pair| pair.to_value_and_invalid_arguments());

                (templates, outdir)
            })
            .map(|(templates, outdir)| {
                let force = option_pairs.clone().into_iter().find(|pair| {
                    self.keyword_same_as_argument(pair.key(), self.options().force().keyword())
                });

                let force = match force {
                    None => (false, None),
                    Some(pair) => (true, pair.value().clone()),
                };

                (templates, outdir, force)
            })
            .map(
                |(templates, outdir, (force, force_invalid_arguments))| match outdir {
                    None => GenerateTemplateResult::IsValid(ValidGenerateTemplateResult::new(
                        templates,
                        force,
                        None,
                        force_invalid_arguments,
                    )),
                    Some(outdir) => {
                        let invalid_arguments = force_invalid_arguments
                            .unwrap_or(vec![])
                            .into_iter()
                            .chain(outdir.invalid_arguments())
                            .collect::<Vec<_>>();

                        GenerateTemplateResult::IsValid(ValidGenerateTemplateResult::new(
                            templates,
                            force,
                            outdir.value(),
                            match invalid_arguments.is_empty() {
                                true => None,
                                false => Some(invalid_arguments),
                            },
                        ))
                    }
                },
            );

        result.unwrap_or(GenerateTemplateResult::IsNotValid)
    }
}
