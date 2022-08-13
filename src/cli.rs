use clap::{App, Arg, ArgMatches};

use crate::util::Str;

pub struct Cli {
    list: Str,
    columns: Str,
    preview: Str,
    search: Str,
    generate: Str,
    outdir: Str,
    append: Str,
    update: Str,
}

impl Cli {
    pub const fn new() -> Self {
        Cli {
            list: "LIST",
            columns: "COLUMNS",
            preview: "PREVIEW",
            search: "SEARCH",
            generate: "GENERATE",
            outdir: "OUTDIR",
            append: "APPEND",
            update: "UPDATE",
        }
    }

    fn extract_first_char_from_str(&self, str: Str) -> char {
        str.to_lowercase()
            .chars()
            .next()
            .unwrap_or_else(|| panic!("{}{}", "Unable to extract first character from ", str))
    }

    pub const fn list(&self) -> Str {
        self.list
    }

    pub const fn width(&self) -> Str {
        self.columns
    }

    pub const fn preview(&self) -> Str {
        self.preview
    }

    pub const fn search(&self) -> Str {
        self.search
    }

    pub const fn generate(&self) -> Str {
        self.generate
    }

    pub const fn outdir(&self) -> Str {
        self.outdir
    }

    pub const fn append(&self) -> Str {
        self.append
    }

    pub const fn update(&self) -> Str {
        self.update
    }

    pub fn args_matches(&self) -> ArgMatches {
        App::new("gitignored")
        .version("0.0.0")
        .author("PoolOfDeath20 a.k.a Gervin Fung Da Xuen <gervinfungdaxuen@gmail.com>")
        .about("CLI application of gitignored")
        .arg(Arg::with_name(self.list())
            .long(self.list().to_lowercase().as_str())
            .short(self.extract_first_char_from_str(self.list()))
            .takes_value(false)
            .help("List all the name of the available Frameworks or Languages or IDEs or Tech"))
        .arg(Arg::with_name(self.width())
            .long(self.width().to_lowercase().as_str())
            .short(self.extract_first_char_from_str(self.width()))
            .takes_value(true)
            .multiple(false)
            .help("Set the the number of columns for the tabular output"))
        .arg(Arg::with_name(self.search())
            .long(self.search().to_lowercase().as_str())
            .short(self.extract_first_char_from_str(self.search()))
            .takes_value(true)
            .multiple(true)
            .help("Search for the name of the Frameworks or Languages or IDEs or Tech. Will provide the closest match if there's no match"))
        .arg(Arg::with_name(self.preview())
            .long(self.preview().to_lowercase().as_str())
            .short(self.extract_first_char_from_str(self.preview()))
            .takes_value(true)
            .multiple(true)
            .help("Preview the individually generated gitignore template chosen for i.e Rust, Java, Yeoman"))
        .arg(Arg::with_name(self.generate())
            .long(self.generate().to_lowercase().as_str())
            .short(self.extract_first_char_from_str(self.generate()))
            .takes_value(true)
            .multiple(true)
            .help("Generate the gitignore template(s) for i.e Rust, TypeScript, Intellij etc. WARNING: this will override any current gitignore"))
        .arg(Arg::with_name(self.outdir())
            .long(self.outdir().to_lowercase().as_str())
            .short(self.extract_first_char_from_str(self.outdir()))
            .takes_value(true)
            .multiple(false)
            .help("Output folder to store the generated gitignore file in"))
        .arg(Arg::with_name(self.append())
            .short(self.extract_first_char_from_str(self.append()))
            .long(self.append().to_lowercase().as_str())
            .takes_value(true)
            .multiple(true)
            .help("Append the gitignore template(s) to pre-existing gitignore, generate one if it doesn't exist"))
        .arg(Arg::with_name(self.update())
            .short(self.extract_first_char_from_str(self.update()))
            .long(self.update().to_lowercase().as_str())
            .takes_value(false)
            .multiple(false)
            .help("Update the cache of gitignore templates"))
        .get_matches()
    }
}
