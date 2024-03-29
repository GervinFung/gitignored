use colored::Colorize;
use prettytable::{Cell, Row, Table};

use crate::{
    api::response::{TemplateNames, Templates},
    cache::templates::Matches,
    types::{Date, OptionalVecString},
};

pub struct Output;

impl Output {
    pub const fn new() -> Self {
        Output {}
    }

    fn filter_names_by_first_character(
        &self,
        template_names: TemplateNames,
        first_character: &str,
    ) -> TemplateNames {
        template_names
            .into_iter()
            .filter(|name| name.starts_with(first_character))
            .collect::<Vec<_>>()
    }

    fn print(&self, template_names: TemplateNames, number_of_columns: u8) {
        let mut table = Table::new();

        // while another row can be constructed, construct one and add to table
        for chunk in template_names.chunks(number_of_columns.into()) {
            let cells = chunk.iter().map(|item| Cell::new(item)).collect::<Vec<_>>();

            let row = Row::new(cells);

            table.add_row(row);
        }

        table.printstd();
    }

    pub fn normal(&self, message: String) {
        println!("{}", message);
    }

    pub fn all_names_separated_by_first_character(
        &self,
        template_names: TemplateNames,
        number_of_columns: u8,
    ) {
        for alphabet in 'A'..='Z' {
            let alphabet = alphabet.to_string();

            println!("\n{}", alphabet.cyan().bold());

            self.print(
                self.filter_names_by_first_character(template_names.clone(), alphabet.as_str()),
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
            format!("{} {}", "Overriding .gitignore at", path)
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
                "{} {}",
                file_path, "already exists, do pass --force if you wish to overwrite it"
            )
            .red()
            .bold()
        )
    }

    pub fn all_filtered_techs(&self, templates: Templates) {
        let mut table = Table::new();

        for template in templates {
            let name = Cell::new(template.name().as_str());

            let content = Cell::new(template.content().as_str());

            table.add_row(Row::new([name, content].to_vec()));
        }

        table.printstd();
    }

    pub fn update_available(&self) {
        println!("{}", "There is an update available".blue().bold());
        println!(
            "{}{}{}",
            "Pass in ".cyan().bold(),
            "'--update'".blue().purple().italic(),
            " argument to update the cache".cyan().bold(),
        );
    }

    pub fn already_up_to_date(&self) {
        println!("{}", "Already up to date".green().bold());
    }

    pub fn show_commit_time_differences(&self, cached_commit_time: Date, latest_commit_time: Date) {
        println!(
            "The previous commit time was {}\nThe latest commit time is {}",
            cached_commit_time.to_string().purple().bold().italic(),
            latest_commit_time.to_string().cyan().bold().italic()
        );
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
            format!("{} {}", "Generating .gitignore at", path)
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
            format!("{} {}", "Appending .gitignore at", path)
                .yellow()
                .bold()
        );
    }

    pub fn appended(&self) {
        println!("{}", "Append completed".green().bold());
    }

    pub fn invalid_argument(&self, argument: String) {
        println!(
            "Invalid arguments of {} is provided",
            argument.red().italic().bold()
        );
    }

    pub fn invalid_arguments(&self, arguments: OptionalVecString) {
        if let Some(arguments) = arguments {
            self.invalid_argument(arguments.join(" "))
        };
    }

    pub fn exact(&self, exact: TemplateNames) {
        if !exact.is_empty() {
            let exact = exact
                .iter()
                .map(|elem| format!("{}", elem.bright_green().bold()))
                .collect::<Vec<_>>();

            let len = exact.len();

            match len {
                1 => {
                    println!("Yes, I have the template for {}", exact.join(", "));
                }
                _ => {
                    let (rest, last) = exact.split_at(len - 1);

                    println!(
                        "Yes, I have the templates for {} and {}",
                        rest.join(", "),
                        last.join("")
                    );
                }
            }
        }
    }

    pub fn closest(&self, closest: Matches) {
        let bright_blue_bold_italic = |string: String| string.bright_blue().bold().italic();

        let magneta_bold_italic = |string: String| string.magenta().bold().italic();

        if !closest.is_empty() {
            let len = closest.len();

            match len {
                1 => {
                    println!(
                        "Unfortunately, I do not have the template for {}",
                        closest
                            .iter()
                            .map(|elem| { format!("{}", magneta_bold_italic(elem.original())) })
                            .collect::<Vec<_>>()
                            .join(", ")
                    );
                    println!(
                        "The closest I can get is {}.\nPerhaps that's what you wanted?",
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
                }
                _ => {
                    let non = closest
                        .iter()
                        .map(|elem| format!("{}", magneta_bold_italic(elem.original())))
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
                        "The closest I can get is {} and {}.\nPerhaps that's what you wanted?",
                        res.join(", "),
                        last.join("")
                    );
                }
            }
        }
    }

    pub fn removing_cache(&self) {
        println!("{}", "Removing cache...".yellow().bold());
    }

    pub fn removed_cache(&self) {
        println!("{}", "Cache removed!".green().bold());
    }

    pub fn uninstalling(&self) {
        println!("{}", "Uninstalling...".yellow().bold());
    }

    pub fn uninstalled(&self) {
        println!("{}", "Uninstalled!".green().bold());
    }
}
