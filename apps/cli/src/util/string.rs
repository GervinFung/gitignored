use crate::cli::keywords::options::KeywordKind;

pub struct StringUtil {}

impl StringUtil {
    pub fn new() -> Self {
        StringUtil {}
    }

    pub fn length_of_longest_keyword(&self, keyword_kinds: Vec<KeywordKind>) -> u8 {
        keyword_kinds
            .into_iter()
            .map(|kind| kind.keyword())
            .map(|keyword| keyword.len() as u8)
            .max()
            .map(|length| length + 1)
            .unwrap()
    }
}
