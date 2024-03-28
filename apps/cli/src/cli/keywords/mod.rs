mod assignment;
pub mod command;
pub mod options;
pub mod subcommand;

use self::{command::Command, options::Options, subcommand::Subcommand};

#[derive(Debug)]
pub struct Keywords {
    option: Options,
    subcommand: Subcommand,
    command: Command,
}

impl Keywords {
    pub fn new() -> Self {
        Keywords {
            command: Command::new(),
            subcommand: Subcommand::new(),
            option: Options::new(),
        }
    }

    pub fn options(&self) -> &Options {
        &self.option
    }

    pub fn subcommand(&self) -> &Subcommand {
        &self.subcommand
    }

    pub fn command(&self) -> &Command {
        &self.command
    }
}
