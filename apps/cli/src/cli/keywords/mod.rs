mod assignment;
pub mod options;
pub mod subcommand;

use self::{options::Options, subcommand::Subcommand};

#[derive(Debug)]
pub struct Keywords {
    option: Options,
    subcommand: Subcommand,
}

impl Keywords {
    pub fn new() -> Self {
        let subcommand = Subcommand::new();

        Keywords {
            subcommand,
            option: Options::new(),
        }
    }

    pub fn options(&self) -> &Options {
        &self.option
    }

    pub fn subcommand(&self) -> &Subcommand {
        &self.subcommand
    }
}
