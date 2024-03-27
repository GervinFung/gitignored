use colored::Colorize;

use crate::cli::keywords::options::KeywordKind;

#[derive(Debug, Clone)]
pub struct Uninstall {
    keyword_kind: KeywordKind,
}

impl Uninstall {
    pub fn new() -> Self {
        Uninstall {
            keyword_kind: KeywordKind::new("uninstall"),
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
            "Uninstall this application and remove all its caches".italic()
        )
    }
}
