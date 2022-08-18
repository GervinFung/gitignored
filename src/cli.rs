use clap::{App, Arg, ArgMatches};

use crate::util::Str;

pub struct Cli;

impl Cli {
    pub const LIST: Str = "LIST";
    pub const COLUMNS: Str = "COLUMNS";
    pub const PREVIEW: Str = "PREVIEW";
    pub const SEARCH: Str = "SEARCH";
    pub const GENERATE: Str = "GENERATE";
    pub const OUTDIR: Str = "OUTDIR";
    pub const APPEND: Str = "APPEND";
    pub const UPDATE: Str = "UPDATE";
    pub const FORCE: Str = "FORCE";

    pub const fn new() -> Self {
        Cli {}
    }

    fn extract_first_char_from_str(&self, str: Str) -> char {
        str.to_lowercase()
            .chars()
            .next()
            .unwrap_or_else(|| panic!("{}{}", "Unable to extract first character from ", str))
    }

    pub fn args_matches(&self) -> ArgMatches {
        App::new("gitignored")
        .version("0.0.0")
        .author("PoolOfDeath20 a.k.a Gervin Fung Da Xuen <gervinfungdaxuen@gmail.com>")
        .about("CLI application of gitignored")
        .arg(Arg::with_name(Cli::LIST)
            .long(Cli::LIST.to_lowercase().as_str())
            .short(self.extract_first_char_from_str(Cli::LIST))
            .takes_value(false)
            .help("List all the name of the available Frameworks or Languages or IDEs or Tech"))
        .arg(Arg::with_name(Cli::COLUMNS)
            .long(Cli::COLUMNS.to_lowercase().as_str())
            .short(self.extract_first_char_from_str(Cli::COLUMNS))
            .takes_value(true)
            .multiple(false)
            .help("Set the the number of columns for the tabular output"))
        .arg(Arg::with_name(Cli::SEARCH)
            .long(Cli::SEARCH.to_lowercase().as_str())
            .short(self.extract_first_char_from_str(Cli::SEARCH))
            .takes_value(true)
            .multiple(true)
            .help("Search for the name of the Frameworks or Languages or IDEs or Tech. Will provide the closest match if there's no match"))
        .arg(Arg::with_name(Cli::PREVIEW)
            .long(Cli::PREVIEW.to_lowercase().as_str())
            .short(self.extract_first_char_from_str(Cli::PREVIEW))
            .takes_value(true)
            .multiple(true)
            .help("Preview the individually generated gitignore template chosen for i.e Rust, Java, Yeoman"))
        .arg(Arg::with_name(Cli::GENERATE)
            .long(Cli::GENERATE.to_lowercase().as_str())
            .short(self.extract_first_char_from_str(Cli::GENERATE))
            .takes_value(true)
            .multiple(true)
            .help("Generate the gitignore template(s) for i.e Rust, TypeScript, Intellij etc. It will not override any current gitignore"))
        .arg(Arg::with_name(Cli::FORCE)
            .long(Cli::FORCE.to_lowercase().as_str())
            .short(self.extract_first_char_from_str(Cli::FORCE))
            .takes_value(false)
            .help("Pair with generate. It will forcefully override any current gitignore"))
        .arg(Arg::with_name(Cli::OUTDIR)
            .long(Cli::OUTDIR.to_lowercase().as_str())
            .short(self.extract_first_char_from_str(Cli::OUTDIR))
            .takes_value(true)
            .multiple(false)
            .help("Output folder to store the generated gitignore file in"))
        .arg(Arg::with_name(Cli::APPEND)
            .short(self.extract_first_char_from_str(Cli::APPEND))
            .long(Cli::APPEND.to_lowercase().as_str())
            .takes_value(true)
            .multiple(true)
            .help("Append the gitignore template(s) to pre-existing gitignore, generate one if it doesn't exist"))
        .arg(Arg::with_name(Cli::UPDATE)
            .short(self.extract_first_char_from_str(Cli::UPDATE))
            .long(Cli::UPDATE.to_lowercase().as_str())
            .takes_value(false)
            .multiple(false)
            .help("Update the cache of gitignore templates"))
        .get_matches()
    }
}
