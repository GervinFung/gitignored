use colored::{ColoredString, Colorize};
use std::io::{self, stdout, Write};

use crate::{cache::templates::Matches, util::NameList};

pub struct Input;

enum InputResult {
    Continue {},
    Break { is_yes: bool },
}

impl Input {
    pub const fn new() -> Self {
        Input {}
    }

    fn green_italic(&self, y: &str) -> ColoredString {
        y.green().italic()
    }

    fn red_italic(&self, n: &str) -> ColoredString {
        n.red().italic()
    }

    fn yes_or_no_only(&self) {
        println!(
            "Please enter '{}'/'{}' or '{}'/'{}' only",
            self.green_italic("y"),
            self.green_italic("Y"),
            self.red_italic("n"),
            self.red_italic("N")
        );
    }

    fn get_input_result(&self) -> InputResult {
        stdout().flush().ok();
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .unwrap_or_else(|_| panic!("Unable to read input"));
        let input = input.trim();
        if "y" == input {
            return InputResult::Break { is_yes: true };
        } else if "n" == input {
            return InputResult::Break { is_yes: false };
        }
        InputResult::Continue {}
    }

    fn is_meant_closest(&self, original: String, closest: String) -> bool {
        loop {
            print!(
                "Could not find template for {}, perhaps you meant {}? [{}/{}]: ",
                original.purple().bold(),
                closest.bright_blue().bold(),
                self.green_italic("y"),
                self.red_italic("N"),
            );
            match self.get_input_result() {
                InputResult::Break { is_yes } => break is_yes,
                InputResult::Continue {} => {
                    self.yes_or_no_only();
                }
            }
        }
    }

    pub fn validate_closest_names(&self, closest: Matches) -> NameList {
        closest
            .iter()
            .filter(|elem| self.is_meant_closest(elem.original(), elem.closest()))
            .map(|elem| elem.closest())
            .collect::<Vec<_>>()
    }

    pub fn confirm_to_proceed(&self) -> bool {
        loop {
            print!(
                "Since some of the template(s) are not what you wanted, do you still want to proceed? [{}/{}]: ",
               self.green_italic("y"),
               self.red_italic("N"),
            );
            match self.get_input_result() {
                InputResult::Break { is_yes } => break is_yes,
                InputResult::Continue {} => {
                    self.yes_or_no_only();
                }
            }
        }
    }
}
