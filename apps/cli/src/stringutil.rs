use crate::cli::keywords::options::KeywordKind;

pub struct StringUtil {
    keyword_kinds: Vec<KeywordKind>,
}

impl StringUtil {
    pub fn new(keyword_kinds: Vec<KeywordKind>) -> Self {
        StringUtil { keyword_kinds }
    }

    fn keyword_kinds(&self) -> Vec<KeywordKind> {
        self.keyword_kinds.clone()
    }

    pub fn length_of_longest_keyword(&self) -> u8 {
        self.keyword_kinds()
            .into_iter()
            .map(|kind| kind.keyword())
            .map(|keyword| keyword.len() as u8)
            .max()
            .map(|length| length + 1)
            .unwrap()
    }
}
