pub mod append;
pub mod generate;
pub mod preview;
pub mod search;
pub mod show;
pub mod update;

use colored::Colorize;

use crate::{
    cli::keywords::assignment::Assignment,
    types::{OptionalVecString, Str, VecString},
};

use self::{
    append::{Append, AppendTemplateResult, ValidAppendTemplateResult},
    generate::{Generate, GenerateTemplateResult, ValidGenerateTemplateResult},
    preview::{Preview, PreviewTemplateResult, ValidPreviewTemplateResult},
    search::{Search, SearchTemplateResult, ValidSearchTemplateResult},
    show::{List, ListTemplateResult, ValidListTemplateResult},
    update::{Update, UpdateTemplateResult, ValidUpdateTemplateResult},
};

#[derive(Clone, Debug)]
struct ValueAndInvalidArguments {
    value: Option<String>,
    invalid_arguments: Vec<String>,
}

impl ValueAndInvalidArguments {
    fn value(&self) -> Option<String> {
        self.value.clone()
    }

    fn invalid_arguments(&self) -> Vec<String> {
        self.invalid_arguments.clone()
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct OptionPair {
    key: String,
    value: Option<Vec<String>>,
}

pub type OptionPairs = Vec<OptionPair>;

impl OptionPair {
    fn with_value(key: String, value: OptionalVecString) -> Self {
        OptionPair { key, value }
    }

    fn empty_value(key: String) -> Self {
        OptionPair { key, value: None }
    }

    fn key(&self) -> &String {
        &self.key
    }

    fn value(&self) -> &OptionalVecString {
        &self.value
    }

    fn split_first_and_rest(&self) -> (Option<String>, VecString) {
        let value = self.to_values();

        let first = value.first().cloned();

        let rest = value.into_iter().skip(1).collect::<Vec<_>>();

        (first, rest)
    }

    fn to_values(&self) -> VecString {
        self.value().clone().unwrap_or_default()
    }

    fn to_option_values(&self) -> OptionalVecString {
        let values = self.to_values();

        match values.is_empty() {
            true => None,
            false => Some(values),
        }
    }

    fn to_value_and_invalid_arguments(&self) -> ValueAndInvalidArguments {
        let (value, invalid_arguments) = self.split_first_and_rest();

        ValueAndInvalidArguments {
            value,
            invalid_arguments,
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum TemplateResultKind {
    Append(ValidAppendTemplateResult),
    Generate(ValidGenerateTemplateResult),
    Preview(ValidPreviewTemplateResult),
    Search(ValidSearchTemplateResult),
    List(ValidListTemplateResult),
    Update(ValidUpdateTemplateResult),
    Never,
}

#[derive(Debug, PartialEq)]
pub enum TemplateResult {
    IsNotValid { arguments: OptionalVecString },
    IsValid { option_pairs: OptionPairs },
}

#[derive(Debug, Clone)]
pub struct Options {
    update: Update,
    show: List,
    search: Search,
    generate: Generate,
    preview: Preview,
    append: Append,
}

impl Options {
    pub fn new() -> Self {
        Options {
            update: Update::new(),
            show: List::new(),
            search: Search::new(),
            generate: Generate::new(),
            preview: Preview::new(),
            append: Append::new(),
        }
    }

    pub fn update(&self) -> &Update {
        &self.update
    }

    pub fn show(&self) -> &List {
        &self.show
    }

    pub fn search(&self) -> &Search {
        &self.search
    }

    pub fn generate(&self) -> &Generate {
        &self.generate
    }

    pub fn preview(&self) -> &Preview {
        &self.preview
    }

    pub fn append(&self) -> &Append {
        &self.append
    }
}

#[derive(Debug, Clone)]
pub struct Template {
    key: Str,
    assignment: Assignment,
    options: Options,
}

impl Template {
    pub fn new() -> Self {
        Template {
            key: "template",
            assignment: Assignment::new(),
            options: Options::new(),
        }
    }

    fn key(&self) -> &Str {
        &self.key
    }

    fn assignment(&self) -> &Assignment {
        &self.assignment
    }

    fn options(&self) -> &Options {
        &self.options
    }

    fn length_of_longest_keyword(&self) -> u8 {
        [
            self.options().update().keyword_kind(),
            self.options().show().keyword_kind(),
            self.options().search().keyword_kind(),
            self.options().generate().keyword_kind(),
            self.options().preview().keyword_kind(),
            self.options().append().keyword_kind(),
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

        let update = self.options().update().description(length);
        let show = self.options().show().description(length);
        let search = self.options().search().description(length);
        let generate = self.options().generate().description(length);
        let preview = self.options().preview().description(length);
        let append = self.options().append().description(length);

        format!(
            "{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n\n{}\n",
            "Usage".bright_yellow(),
            update,
            show,
            search,
            generate,
            preview,
            append
        )
    }

    pub fn parse(&self, text: String) -> TemplateResult {
        let arguments = text
            .split(self.assignment().assign().space())
            .filter(|text| !text.is_empty())
            .map(|text| text.trim())
            .collect::<Vec<_>>();

        match arguments.first() {
            None => TemplateResult::IsNotValid { arguments: None },
            Some(template) => {
                let is_template = template == self.key();

                match is_template {
                    false => TemplateResult::IsNotValid {
                        arguments: Some(
                            arguments
                                .into_iter()
                                .map(|argument| argument.to_string())
                                .collect::<Vec<_>>(),
                        ),
                    },
                    true => {
                        let option_pairs = arguments
                            .into_iter()
                            .skip(1)
                            .flat_map(|argument| argument.split(self.assignment().assign().equal()))
                            .fold(vec![] as OptionPairs, |optional_pairs, argument| {
                                let start_with =
                                    argument.starts_with(self.assignment().option().declaration());

                                match start_with {
                                    true => optional_pairs
                                        .into_iter()
                                        .chain(vec![OptionPair::empty_value(argument.to_string())])
                                        .collect::<Vec<_>>(),
                                    false => match optional_pairs.last() {
                                        None => optional_pairs,
                                        Some(last) => optional_pairs
                                            .clone()
                                            .into_iter()
                                            .enumerate()
                                            .map(|(index, pair)| {
                                                let is_last = index == optional_pairs.len() - 1;

                                                match is_last {
                                                    false => pair,
                                                    true => {
                                                        let value = match last.value() {
                                                            Some(value) => value.clone(),
                                                            None => vec![] as Vec<String>,
                                                        };

                                                        let value = value
                                                            .into_iter()
                                                            .chain(vec![argument.to_string()])
                                                            .collect::<Vec<_>>();

                                                        OptionPair::with_value(
                                                            last.key().to_string(),
                                                            Some(value),
                                                        )
                                                    }
                                                }
                                            })
                                            .collect::<Vec<_>>(),
                                    },
                                }
                            });

                        TemplateResult::IsValid { option_pairs }
                    }
                }
            }
        }
    }

    pub fn parse_to_result(&self, argument: String) -> TemplateResultKind {
        let result = self.parse(argument.clone());

        let option_pairs = match result {
            TemplateResult::IsValid { option_pairs } => option_pairs,
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
        };

        let update = self.options().update().parse(option_pairs.clone());

        let result = match update {
            UpdateTemplateResult::IsValid(result) => TemplateResultKind::Update(result),
            UpdateTemplateResult::IsNotValid => {
                let show = self.options().show().parse(option_pairs.clone());

                let show = match show {
                    ListTemplateResult::IsValid(result) => TemplateResultKind::List(result),
                    ListTemplateResult::IsNotValid => {
                        let search = self.options().search().parse(option_pairs.clone());

                        let search = match search {
                            SearchTemplateResult::IsValid(result) => {
                                TemplateResultKind::Search(result)
                            }
                            SearchTemplateResult::IsNotValid => {
                                let generate =
                                    self.options().generate().parse(option_pairs.clone());

                                let generate = match generate {
                                    GenerateTemplateResult::IsValid(result) => {
                                        TemplateResultKind::Generate(result)
                                    }
                                    GenerateTemplateResult::IsNotValid => {
                                        let preview =
                                            self.options().preview().parse(option_pairs.clone());

                                        let preview = match preview {
                                            PreviewTemplateResult::IsValid(result) => {
                                                TemplateResultKind::Preview(result)
                                            }
                                            PreviewTemplateResult::IsNotValid => {
                                                let append =
                                                    self.options().append().parse(option_pairs);

                                                match append {
                                                    AppendTemplateResult::IsValid(result) => {
                                                        TemplateResultKind::Append(result)
                                                    }
                                                    AppendTemplateResult::IsNotValid => {
                                                        TemplateResultKind::Never
                                                    }
                                                }
                                            }
                                        };

                                        preview
                                    }
                                };

                                generate
                            }
                        };

                        search
                    }
                };

                show
            }
        };

        result
    }
}

#[cfg(test)]
mod update_tests {
    use crate::{
        cli::keywords::{
            assignment::Assignment,
            subcommand::template::{
                append::ValidAppendTemplateResult,
                generate::{GenerateTemplateResult, ValidGenerateTemplateResult},
                preview::ValidPreviewTemplateResult,
                search::{SearchTemplateResult, ValidSearchTemplateResult},
                show::ValidListTemplateResult,
                update::ValidUpdateTemplateResult,
                TemplateResultKind,
            },
        },
        types::Str,
    };

    use super::{
        append::AppendTemplateResult, preview::PreviewTemplateResult, show::ListTemplateResult,
        update::UpdateTemplateResult, TemplateResult,
    };

    struct Assign;

    impl Assign {
        fn new() -> Self {
            Assign {}
        }

        fn symbols(&self) -> Vec<Str> {
            let assign = Assignment::new();
            let assign = assign.assign();

            vec![assign.space(), assign.equal()]
        }
    }

    #[test]
    fn it_should_parse_update() {
        let template = super::Template::new();

        let result = template.parse("template --update".to_string());

        match result {
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
            TemplateResult::IsValid { option_pairs } => {
                assert_eq!(
                    template.options().update().parse(option_pairs),
                    UpdateTemplateResult::IsValid(ValidUpdateTemplateResult::new(None))
                )
            }
        };

        let result = template.parse("template --update this is all invalid".to_string());

        match result {
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
            TemplateResult::IsValid { option_pairs } => {
                assert_eq!(
                    template.options().update().parse(option_pairs),
                    UpdateTemplateResult::IsValid(ValidUpdateTemplateResult::new(Some(vec![
                        "this".to_string(),
                        "is".to_string(),
                        "all".to_string(),
                        "invalid".to_string(),
                    ])))
                )
            }
        };

        let result = template.parse("this is also invalid template --update".to_string());

        assert_eq!(
            result,
            TemplateResult::IsNotValid {
                arguments: Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "also".to_string(),
                    "invalid".to_string(),
                    "template".to_string(),
                    "--update".to_string(),
                ])
            }
        );
    }

    #[test]
    fn it_should_parse_search() {
        let template = super::Template::new();

        let assign = Assign::new();

        assign.symbols().into_iter().for_each(|delimiter| {
            let result =
                template.parse(format!("template --search{}java rust", delimiter).to_string());

            match result {
                TemplateResult::IsNotValid { arguments } => {
                    panic!("Arguments of {:?} was received", arguments)
                }
                TemplateResult::IsValid { option_pairs } => {
                    assert_eq!(
                        template.options().search().parse(option_pairs),
                        SearchTemplateResult::IsValid(ValidSearchTemplateResult::new(Some(vec![
                            "java".to_string(),
                            "rust".to_string()
                        ])))
                    )
                }
            };

            let result = template.parse(
                format!(
                    "template --search{}java rust this is all invalid",
                    delimiter
                )
                .to_string(),
            );

            match result {
                TemplateResult::IsNotValid { arguments } => {
                    panic!("Arguments of {:?} was received", arguments)
                }
                TemplateResult::IsValid { option_pairs } => {
                    assert_eq!(
                        template.options().search().parse(option_pairs),
                        SearchTemplateResult::IsValid(ValidSearchTemplateResult::new(Some(vec![
                            "java".to_string(),
                            "rust".to_string(),
                            "this".to_string(),
                            "is".to_string(),
                            "all".to_string(),
                            "invalid".to_string(),
                        ])))
                    );
                }
            };
        });

        assign.symbols().into_iter().for_each(|delimiter| {
            let result = template
                .parse(format!("this is also invalid template{}--search", delimiter).to_string());

            assert_eq!(
                result,
                TemplateResult::IsNotValid {
                    arguments: Some(match delimiter {
                        " " => vec![
                            "this".to_string(),
                            "is".to_string(),
                            "also".to_string(),
                            "invalid".to_string(),
                            "template".to_string(),
                            "--search".to_string(),
                        ],
                        "=" => vec![
                            "this".to_string(),
                            "is".to_string(),
                            "also".to_string(),
                            "invalid".to_string(),
                            "template=--search".to_string(),
                        ],
                        _ => panic!("delimiter can only be space or equal"),
                    }),
                }
            );
        });

        let result = template.parse("template --search".to_string());

        match result {
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
            TemplateResult::IsValid { option_pairs } => {
                let result = template.options().search().parse(option_pairs);

                assert_eq!(
                    result,
                    SearchTemplateResult::IsValid(ValidSearchTemplateResult::new(None))
                )
            }
        };
    }

    #[test]
    fn it_should_parse_preview() {
        let template = super::Template::new();

        let assign = Assign::new();

        assign.symbols().into_iter().for_each(|delimiter| {
            let result =
                template.parse(format!("template --preview{}java rust", delimiter).to_string());

            match result {
                TemplateResult::IsNotValid { arguments } => {
                    panic!("Arguments of {:?} was received", arguments)
                }
                TemplateResult::IsValid { option_pairs } => {
                    assert_eq!(
                        template.options().preview().parse(option_pairs),
                        PreviewTemplateResult::IsValid(ValidPreviewTemplateResult::new(Some(
                            vec!["java".to_string(), "rust".to_string()]
                        )))
                    )
                }
            };

            let result = template.parse(
                format!(
                    "template --preview{}java rust this is all invalid",
                    delimiter
                )
                .to_string(),
            );

            match result {
                TemplateResult::IsNotValid { arguments } => {
                    panic!("Arguments of {:?} was received", arguments)
                }
                TemplateResult::IsValid { option_pairs } => {
                    assert_eq!(
                        template.options().preview().parse(option_pairs),
                        PreviewTemplateResult::IsValid(ValidPreviewTemplateResult::new(Some(
                            vec![
                                "java".to_string(),
                                "rust".to_string(),
                                "this".to_string(),
                                "is".to_string(),
                                "all".to_string(),
                                "invalid".to_string(),
                            ]
                        )))
                    )
                }
            };
        });

        assign.symbols().into_iter().for_each(|delimiter| {
            let result = template
                .parse(format!("this is also invalid template{}--preview", delimiter).to_string());

            assert_eq!(
                result,
                TemplateResult::IsNotValid {
                    arguments: Some(match delimiter {
                        " " => vec![
                            "this".to_string(),
                            "is".to_string(),
                            "also".to_string(),
                            "invalid".to_string(),
                            "template".to_string(),
                            "--preview".to_string(),
                        ],
                        "=" => vec![
                            "this".to_string(),
                            "is".to_string(),
                            "also".to_string(),
                            "invalid".to_string(),
                            "template=--preview".to_string(),
                        ],
                        _ => panic!("delimiter can only be space or equal"),
                    }),
                }
            );

            let result = template.parse(format!("template{}--preview", delimiter));

            match result {
                TemplateResult::IsNotValid { arguments } => match delimiter == " " {
                    true => panic!("Arguments of {:?} was received", arguments),
                    false => assert_eq!(arguments, Some(vec!["template=--preview".to_string()])),
                },
                TemplateResult::IsValid { option_pairs } => {
                    match delimiter == " " {
                        false => panic!("Option_Pairs of {:?} was received", option_pairs),
                        true => {
                            assert_eq!(
                                template.options().preview().parse(option_pairs),
                                PreviewTemplateResult::IsValid(ValidPreviewTemplateResult::new(
                                    None
                                ))
                            )
                        }
                    };
                }
            };
        });
    }

    #[test]
    fn it_should_parse_show() {
        let template = super::Template::new();

        let result = template.parse("template --list".to_string());

        match result {
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
            TemplateResult::IsValid { option_pairs } => {
                assert_eq!(
                    template.options().show().parse(option_pairs),
                    ListTemplateResult::IsValid(ValidListTemplateResult::new(4, None))
                );
            }
        };

        let result = template.parse("template --list this is all invalid".to_string());

        match result {
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
            TemplateResult::IsValid { option_pairs } => {
                assert_eq!(
                    template.options().show().parse(option_pairs),
                    ListTemplateResult::IsValid(ValidListTemplateResult::new(
                        4,
                        Some(vec![
                            "this".to_string(),
                            "is".to_string(),
                            "all".to_string(),
                            "invalid".to_string(),
                        ])
                    ))
                );
            }
        };

        let assign = Assign::new();

        assign.symbols().into_iter().for_each(|delimiter| {
            let result = template.parse(
                format!(
                    "template --list --column{}9 java rust purescript reasonml",
                    delimiter
                )
                .to_string(),
            );

            match result {
                TemplateResult::IsNotValid { arguments } => {
                    panic!("Arguments of {:?} was received", arguments)
                }
                TemplateResult::IsValid { option_pairs } => {
                    assert_eq!(
                        template.options().show().parse(option_pairs),
                        ListTemplateResult::IsValid(ValidListTemplateResult::new(
                            9,
                            Some(vec![
                                "java".to_string(),
                                "rust".to_string(),
                                "purescript".to_string(),
                                "reasonml".to_string(),
                            ])
                        ))
                    );
                }
            };
        });

        let result = template.parse("this is also invalid template --list".to_string());

        assert_eq!(
            result,
            TemplateResult::IsNotValid {
                arguments: Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "also".to_string(),
                    "invalid".to_string(),
                    "template".to_string(),
                    "--list".to_string(),
                ])
            }
        );
    }

    #[test]
    fn it_should_parse_generate() {
        let template = super::Template::new();

        let assign = Assign::new();

        assign
            .symbols()
            .into_iter()
            .flat_map(|delimiter| {
                [vec![], vec!["outdir"], vec!["outdir", "extra", "useless"]]
                    .into_iter()
                    .map(|values| (values.clone(), delimiter.to_owned()))
                    .flat_map(|(outdir, delimiter)| {
                        [true, false].map(|force| (outdir.clone(), delimiter.clone(), force))
                    })
            })
            .for_each(|(outdir_param, delimiter_param, force_param)| {
                let command = format!(
                    "template --generate{}java rust {} {}",
                    delimiter_param,
                    match outdir_param.is_empty() {
                        true => "".to_string(),
                        false => format!(
                            "--outdir{}{}",
                            delimiter_param,
                            outdir_param.clone().join(" ")
                        ),
                    },
                    match force_param {
                        true => "--force",
                        false => "",
                    },
                );

                let result = template.parse(command.clone());

                let outdir_result = match outdir_param.is_empty() {
                    true => None,
                    false => Some("outdir".to_string()),
                };

                match result {
                    TemplateResult::IsNotValid { arguments } => {
                        panic!("Arguments of {:?} was received", arguments)
                    }
                    TemplateResult::IsValid { option_pairs } => {
                        let extra_arguments = outdir_param
                            .clone()
                            .into_iter()
                            .skip(1)
                            .map(|text| text.to_string())
                            .collect::<Vec<_>>();

                        assert_eq!(
                            template.options().generate().parse(option_pairs),
                            GenerateTemplateResult::IsValid(ValidGenerateTemplateResult::new(
                                Some(
                                    ["java", "rust"]
                                        .into_iter()
                                        .map(|text| text.to_string())
                                        .collect::<Vec<_>>()
                                ),
                                force_param,
                                outdir_result,
                                match outdir_param.clone().is_empty() {
                                    true => None,
                                    false => match extra_arguments.is_empty() {
                                        true => None,
                                        false => Some(extra_arguments),
                                    },
                                }
                            ))
                        );
                    }
                }
            });

        let result = template.parse("this is also invalid template --generate".to_string());

        assert_eq!(
            result,
            TemplateResult::IsNotValid {
                arguments: Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "also".to_string(),
                    "invalid".to_string(),
                    "template".to_string(),
                    "--generate".to_string(),
                ])
            }
        );

        let result = template.parse("template --generate".to_string());

        match result {
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
            TemplateResult::IsValid { option_pairs } => {
                assert_eq!(
                    template.options().generate().parse(option_pairs),
                    GenerateTemplateResult::IsValid(ValidGenerateTemplateResult::new(
                        None, false, None, None
                    ))
                );
            }
        };
    }

    #[test]
    fn it_should_parse_append() {
        let template = super::Template::new();

        Assign::new()
            .symbols()
            .into_iter()
            .flat_map(|delimiter| {
                [vec![], vec!["outdir"], vec!["outdir", "extra", "useless"]]
                    .into_iter()
                    .map(|values| (values.clone(), delimiter.to_owned()))
            })
            .for_each(|(outdir_param, delimiter_param)| {
                let command = format!(
                    "template --append{}java rust {}",
                    delimiter_param,
                    match outdir_param.is_empty() {
                        true => "".to_string(),
                        false => format!(
                            "--outdir{}{}",
                            delimiter_param,
                            outdir_param.clone().join(" ")
                        ),
                    },
                );

                let result = template.parse(command.clone());

                let outdir_result = match outdir_param.is_empty() {
                    true => None,
                    false => Some("outdir".to_string()),
                };

                match result {
                    TemplateResult::IsNotValid { arguments } => {
                        panic!("Arguments of {:?} was received", arguments)
                    }
                    TemplateResult::IsValid { option_pairs } => {
                        let extra_arguments = outdir_param
                            .clone()
                            .into_iter()
                            .skip(1)
                            .map(|text| text.to_string())
                            .collect::<Vec<_>>();

                        assert_eq!(
                            template.options().append().parse(option_pairs),
                            AppendTemplateResult::IsValid(ValidAppendTemplateResult::new(
                                Some(
                                    ["java", "rust"]
                                        .into_iter()
                                        .map(|text| text.to_string())
                                        .collect::<Vec<_>>()
                                ),
                                outdir_result,
                                match outdir_param.clone().is_empty() {
                                    true => None,
                                    false => match extra_arguments.is_empty() {
                                        true => None,
                                        false => Some(extra_arguments),
                                    },
                                }
                            ))
                        );
                    }
                }
            });

        let result = template.parse("this is also invalid template --append".to_string());

        assert_eq!(
            result,
            TemplateResult::IsNotValid {
                arguments: Some(vec![
                    "this".to_string(),
                    "is".to_string(),
                    "also".to_string(),
                    "invalid".to_string(),
                    "template".to_string(),
                    "--append".to_string(),
                ])
            }
        );

        let result = template.parse("template --append".to_string());

        match result {
            TemplateResult::IsNotValid { arguments } => {
                panic!("Arguments of {:?} was received", arguments)
            }
            TemplateResult::IsValid { option_pairs } => {
                assert_eq!(
                    template.options().append().parse(option_pairs),
                    AppendTemplateResult::IsValid(ValidAppendTemplateResult::new(None, None, None))
                );
            }
        };
    }

    #[test]
    fn it_should_parse_to_result() {
        let template = super::Template::new();

        let result = template.parse_to_result("template --update".to_string());

        assert_eq!(
            result,
            TemplateResultKind::Update(ValidUpdateTemplateResult::new(None))
        );

        let result = template.parse_to_result("template --search purescript haskell".to_string());

        assert_eq!(
            result,
            TemplateResultKind::Search(ValidSearchTemplateResult::new(Some(vec![
                "purescript".to_string(),
                "haskell".to_string(),
            ])))
        );

        let result = template.parse_to_result("template --preview purescript haskell".to_string());

        assert_eq!(
            result,
            TemplateResultKind::Preview(ValidPreviewTemplateResult::new(Some(vec![
                "purescript".to_string(),
                "haskell".to_string(),
            ])))
        );

        let result =
            template.parse_to_result("template --list purescript haskell --column 9".to_string());

        assert_eq!(
            result,
            TemplateResultKind::List(ValidListTemplateResult::new(
                9,
                Some(vec!["purescript".to_string(), "haskell".to_string(),]),
            ))
        );

        let result = template.parse_to_result(
            "template --generate purescript haskell --force --outdir out".to_string(),
        );

        assert_eq!(
            result,
            TemplateResultKind::Generate(ValidGenerateTemplateResult::new(
                Some(vec!["purescript".to_string(), "haskell".to_string(),]),
                true,
                Some("out".to_string()),
                None,
            ))
        );

        let result = template
            .parse_to_result("template --append purescript haskell --outdir out".to_string());

        assert_eq!(
            result,
            TemplateResultKind::Append(ValidAppendTemplateResult::new(
                Some(vec!["purescript".to_string(), "haskell".to_string(),]),
                Some("out".to_string()),
                None,
            ))
        );

        let result = template.parse_to_result("template hello it's me".to_string());

        assert_eq!(result, TemplateResultKind::Never)
    }
}
