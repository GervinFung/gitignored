use colored::Colorize;

use crate::cli::keywords::options::KeywordKind;

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
