mod api;
mod cache;
mod cli;
mod env;
mod input;
mod output;
mod util;

use chrono::{DateTime, Utc};
use cli::Cli;
use directories::ProjectDirs;
use env::Env;
use input::Input;

fn main() {
    let api = api::GitIgnoredApi::new(Env::API);
    let cache = ProjectDirs::from("", ".gitignored", Env::CACHE)
        .unwrap_or_else(|| panic!("Unable to create cache directory"));
    let name = String::from(
        cache
            .cache_dir()
            .to_str()
            .unwrap_or_else(|| panic!("Unable to create cache directory")),
    );
    let cache = cache::Cache::new(name);
    let cli = Cli::new();
    let args_matcher = cli.args_matches();
    let output = output::Output::new();
    if !cache.has_been_created() {
        output.generating_cache();
        cache.generate(api.latest_commit_time(), api.name_and_content_list());
        output.generated_cache();
    }

    let latest_commit_time = api.latest_commit_time();
    let should_update_cache = cache.should_update(latest_commit_time);

    let current_time = DateTime::parse_from_rfc3339(Utc::now().to_rfc3339().as_str()).unwrap();

    if should_update_cache && cache.should_remind(current_time) {
        output.update_available();
        cache.update_last_remind_time(current_time);
    }

    let get_outdir = || {
        let current_dir =
            std::env::current_dir().unwrap_or_else(|_| panic!("Unable to get current directory"));
        let outdir = args_matcher.value_of(Cli::OUTDIR).unwrap_or("");
        let outdir = if outdir.is_empty() {
            "".to_string()
        } else {
            format!("{}{}", outdir, "/")
        };
        format!(
            "{}/{}{}",
            current_dir
                .to_str()
                .unwrap_or_else(|| panic!("Unable to unwrap current dir as str")),
            outdir,
            Env::FILE_NAME
        )
    };

    if args_matcher.is_present(Cli::LIST) {
        output.all_names_separated_by_first_character(
            cache.name_list(),
            args_matcher
                .value_of(Cli::COLUMNS)
                .unwrap_or("4")
                .parse::<u8>()
                .unwrap_or_else(|_| panic!("Unable to parse as u8 for tabular column width")),
        );
    } else if args_matcher.is_present(Cli::SEARCH) {
        let matches = cache.search_name_list(
            args_matcher
                .values_of(Cli::SEARCH)
                .unwrap_or_else(|| panic!("Unable to get arguments from '-s'"))
                .collect::<Vec<_>>(),
        );
        output.exact(matches.exact());
        output.closest(matches.closest());
    } else if args_matcher.is_present(Cli::PREVIEW) {
        let matches = cache.search_name_list(
            args_matcher
                .values_of(Cli::PREVIEW)
                .unwrap_or_else(|| panic!("Unable to get arguments from '-p'"))
                .collect::<Vec<_>>(),
        );
        output.exact(matches.exact());
        output.closest(matches.closest());
        let preview_name_list = matches
            .exact()
            .into_iter()
            .chain(matches.closest().into_iter().map(|elem| elem.closest()))
            .collect::<Vec<_>>();
        output.all_filtered_techs(cache.filter_name_and_content_list(preview_name_list));
    } else if args_matcher.is_present(Cli::GENERATE) {
        let is_force_override = args_matcher.is_present(Cli::FORCE);
        let out_dir = get_outdir();
        let already_has_destination_file = cache.already_has_destination_file(out_dir.clone());
        if already_has_destination_file && !is_force_override {
            output.already_has_destination_file(out_dir);
        } else {
            let matches = cache.search_name_list(
                args_matcher
                    .values_of(Cli::GENERATE)
                    .unwrap_or_else(|| panic!("Unable to get arguments from '-g'"))
                    .collect::<Vec<_>>(),
            );
            let input = Input::new();
            let closest = matches.closest();
            let exact = matches.exact().into_iter();
            let names = input
                .validate_closest_names(closest.clone())
                .into_iter()
                .chain(exact.clone())
                .collect::<Vec<_>>();

            if (closest.len() + exact.len() == names.len()) || (input.confirm_to_proceed()) {
                if already_has_destination_file {
                    output.overriding(out_dir.clone());
                } else {
                    output.generating(out_dir.clone());
                }

                cache.generate_gitignore_file(names, out_dir);

                if already_has_destination_file {
                    output.overrided();
                } else {
                    output.generated();
                }
            } else {
                output.terminated("Generate");
            }
        }
    } else if args_matcher.is_present(Cli::APPEND) {
        let matches = cache.search_name_list(
            args_matcher
                .values_of(Cli::APPEND)
                .unwrap_or_else(|| panic!("Unable to get arguments from '-a'"))
                .collect::<Vec<_>>(),
        );
        let input = Input::new();
        let closest = matches.closest();
        let exact = matches.exact().into_iter();
        let names = input
            .validate_closest_names(closest.clone())
            .into_iter()
            .chain(exact.clone())
            .collect::<Vec<_>>();

        if (closest.len() + exact.len() == names.len()) || (input.confirm_to_proceed()) {
            let out_dir = get_outdir();
            output.appending(out_dir.clone());
            cache.append_gitignore_file(names, out_dir);
            output.appended();
        } else {
            output.terminated("Append");
        }
    } else if args_matcher.is_present(Cli::UPDATE) && cache.has_been_created() {
        if cache.latest_commit_time() == latest_commit_time {
            output.already_up_to_date();
        } else {
            output.updating();
            cache.generate(latest_commit_time, api.name_and_content_list());
            output.updated();
        }
    }
}
