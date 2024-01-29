use colored::Colorize;

use crate::env::Env;

use self::keywords::Keywords;

pub mod keywords;

pub struct Cli {
    keywords: Keywords,
}

impl Cli {
    pub fn new() -> Self {
        Cli {
            keywords: Keywords::new(),
        }
    }

    pub fn keywords(&self) -> &Keywords {
        &self.keywords
    }

    pub fn pre_basic_info(&self) -> String {
        format!(
            "\n{} {}\n\n{}\n\n{}\n\n",
            Env::NAME.blue().bold(),
            Env::VERSION,
            Env::AUTHOR.white().bold(),
            Env::ABOUT,
        )
    }
}
