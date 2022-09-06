use colored::Colorize;
use prettytable::{Cell, Row, Table};

use crate::{
    cache::Matches,
    util::{NameAndContentList, NameList},
};

pub struct Output;

impl Output {
    pub const fn new() -> Self {
        Output {}
    }
    fn filter_names_by_first_character(
        &self,
        name_list: NameList,
        first_character: &str,
    ) -> NameList {
        name_list
            .into_iter()
            .filter(|name| name.starts_with(first_character))
            .collect::<Vec<_>>()
    }
    fn print(&self, name_list: NameList, number_of_columns: u8) {
        let mut table = Table::new();

        // while another row can be constructed, construct one and add to table
        for chunk in name_list.chunks(number_of_columns.into()) {
            let cells = chunk.iter().map(|item| Cell::new(item)).collect::<Vec<_>>();
            let row = Row::new(cells);
            table.add_row(row);
        }

        table.printstd();
    }
    pub fn all_names_separated_by_first_character(
        &self,
        name_list: NameList,
        number_of_columns: u8,
    ) {
        for alphabet in 'A'..='Z' {
            let alphabet = alphabet.to_string();
            println!("\n{}", alphabet.cyan().bold());
            self.print(
                self.filter_names_by_first_character(name_list.clone(), alphabet.as_str()),
                number_of_columns,
            );
        }

        println!();
    }
    pub fn generating_cache(&self) {
        println!("{}", "Generating cache...".yellow().bold())
    }
    pub fn generated_cache(&self) {
        println!("{}", "Cache generated!".green().bold())
    }
    pub fn overriding(&self, path: String) {
        println!(
            "{}",
            format!("{}{}", "Overriding .gitignore at ", path)
                .yellow()
                .bold()
        );
    }
    pub fn overrided(&self) {
        println!("{}", "Overriding completed".green().bold());
    }
    pub fn already_has_destination_file(&self, file_path: String) {
        println!(
            "{}",
            format!(
                "{}{}",
                file_path, " already exists, do pass -f if you wish to overwrite it"
            )
            .red()
            .bold()
        )
    }
    pub fn all_filtered_techs(&self, name_and_content_list: NameAndContentList) {
        let mut table = Table::new();

        for name_and_content in name_and_content_list {
            let name = Cell::new(name_and_content.name().as_str());
            let content = Cell::new(name_and_content.content().as_str());
            table.add_row(Row::new([name, content].to_vec()));
        }

        table.printstd();
    }
    pub fn update_available(&self) {
        println!("{}", "There is an update available".blue().bold());
        println!(
            "{}{}{}",
            "Pass in ".cyan().bold(),
            "'-u'".blue().purple().italic(),
            " argument to update the cache".cyan().bold(),
        );
    }
    pub fn already_up_to_date(&self) {
        println!("{}", "Already up to date".green().bold());
    }
    pub fn updating(&self) {
        println!("{}", "Updating gitignore templates".yellow().bold());
    }
    pub fn updated(&self) {
        println!("{}", "Update completed".green().bold());
    }
    pub fn terminated(&self, process_name: &str) {
        println!(
            "{} {}",
            process_name.green().bold(),
            "process terminated".green().bold()
        );
    }
    pub fn generating(&self, path: String) {
        println!(
            "{}",
            format!("{}{}", "Generating .gitignore at ", path)
                .yellow()
                .bold()
        );
    }
    pub fn generated(&self) {
        println!("{}", "Generation completed".green().bold());
    }
    pub fn appending(&self, path: String) {
        println!(
            "{}",
            format!("{}{}", "Appending .gitignore at ", path)
                .yellow()
                .bold()
        );
    }
    pub fn appended(&self) {
        println!("{}", "Append completed".green().bold());
    }
    pub fn exact(&self, exact: NameList) {
        if !exact.is_empty() {
            let exact = exact
                .iter()
                .map(|elem| format!("{}", elem.bright_green().bold()))
                .collect::<Vec<_>>();
            let len = exact.len();
            if len == 1 {
                println!("Yes, I have the template for {}", exact.join(", "));
            } else {
                let (rest, last) = exact.split_at(len - 1);
                println!(
                    "Yes, I have the templates for {} and {}",
                    rest.join(", "),
                    last.join("")
                );
            }
        }
    }
    pub fn closest(&self, closest: Matches) {
        let bright_blue_bold_italic = |string: String| string.bright_blue().bold().italic();
        let magneta_bold_italic = |string: String| string.magenta().bold().italic();
        if !closest.is_empty() {
            let len = closest.len();
            if len == 1 {
                println!(
                    "Unfortunately, I do not have the template for {}",
                    closest
                        .iter()
                        .map(|elem| { format!("{}", bright_blue_bold_italic(elem.original())) })
                        .collect::<Vec<_>>()
                        .join(", ")
                );
                println!(
                    "The closest I can get is {}. Perhaps that's what you wanted?",
                    closest
                        .iter()
                        .map(|elem| {
                            format!(
                                "{} for {}",
                                bright_blue_bold_italic(elem.closest()),
                                magneta_bold_italic(elem.original())
                            )
                        })
                        .collect::<Vec<_>>()
                        .join(", ")
                );
            } else {
                let non = closest
                    .iter()
                    .map(|elem| format!("{}", bright_blue_bold_italic(elem.original())))
                    .collect::<Vec<_>>();
                let (res, last) = non.split_at(len - 1);
                println!(
                    "Unfortunately, I do not have the templates for {} and {}",
                    res.join(", "),
                    last.join("")
                );
                let closest_non_pair = closest
                    .iter()
                    .map(|elem| {
                        format!(
                            "{} for {}",
                            bright_blue_bold_italic(elem.closest()),
                            magneta_bold_italic(elem.original())
                        )
                    })
                    .collect::<Vec<_>>();
                let (res, last) = closest_non_pair.split_at(len - 1);
                println!(
                    "The closest I can get is {} and {}. Perhaps that's what you wanted?",
                    res.join(", "),
                    last.join("")
                );
            }
        }
    }
}
