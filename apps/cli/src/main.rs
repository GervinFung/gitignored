mod api;
mod cache;
mod cli;
mod env;
mod input;
mod output;
mod types;

use api::GitignoredApi;
use cache::Cache;
use chrono::{DateTime, Utc};
use cli::{
    keywords::{options::OptionsResultKind, subcommand::template::TemplateResultKind},
    Cli,
};
use directories::ProjectDirs;
use env::Env;
use input::Input;
use output::Output;

use std::env as stdenv;

fn main() {
    let cli = Cli::new();

    let argument: Vec<String> = stdenv::args().collect();

    let argument = argument.into_iter().skip(1).collect::<Vec<_>>().join(" ");

    let output = Output::new();

    match cli.keywords().options().parse_to_result(
        argument.clone(),
        format!(
            "{}{}",
            cli.pre_basic_info(),
            cli.keywords().subcommand().template().description()
        ),
    ) {
        OptionsResultKind::Help(result) => {
            output.normal(result.value());

            output.invalid_arguments(result.invalid_arguments());
        }
        OptionsResultKind::Version(result) => {
            output.normal(result.value());

            output.invalid_arguments(result.invalid_arguments());
        }
        OptionsResultKind::Never => {
            let api = GitignoredApi::new(Env::API);

            let cache = ProjectDirs::from("", ".gitignored", Env::CACHE)
                .unwrap_or_else(|| panic!("Unable to create cache directory"));

            let name = String::from(
                cache
                    .cache_dir()
                    .to_str()
                    .unwrap_or_else(|| panic!("Unable to create cache directory")),
            );

            let cache = Cache::new(name, Env::API);

            let templates = || api.templates().templates().unwrap().data().to_owned();

            let latest_committed_time = || {
                api.latest_committed_time()
                    .latest_committed_time()
                    .unwrap()
                    .data()
                    .to_owned()
            };

            if !cache.has_been_created() {
                output.generating_cache();

                cache.generate(latest_committed_time(), templates());

                output.generated_cache();
            }

            let latest_committed_time = latest_committed_time();

            let should_update_cache = cache.should_update(latest_committed_time);

            let current_time =
                DateTime::parse_from_rfc3339(Utc::now().to_rfc3339().as_str()).unwrap();

            if should_update_cache && cache.should_remind(current_time) {
                output.update_available();
                cache.update_last_remind_time(current_time);
            }

            let get_outdir = |provided_outdir: Option<String>| {
                let current_dir = stdenv::current_dir()
                    .unwrap_or_else(|_| panic!("Unable to get current directory"));

                let outdir = match provided_outdir {
                    None => "".to_string(),
                    Some(outdir) => format!("{}/", outdir),
                };

                let current_dir = current_dir
                    .to_str()
                    .unwrap_or_else(|| panic!("Unable to unwrap current dir as str"));

                format!("{}/{}{}", current_dir, outdir, Env::FILE_NAME)
            };

            match cli
                .keywords()
                .subcommand()
                .template()
                .parse_to_result(argument.clone())
            {
                TemplateResultKind::Never => output.invalid_argument(argument),
                TemplateResultKind::Update(result) => {
                    match cache.latest_committed_time() == latest_committed_time {
                        true => output.already_up_to_date(),
                        false => {
                            output.updating();
                            cache.generate(latest_committed_time, templates());
                            output.updated();
                        }
                    };

                    output.invalid_arguments(result.invalid_arguments());
                }
                TemplateResultKind::Show(result) => {
                    output.all_names_separated_by_first_character(
                        cache.template_names(),
                        result.column(),
                    );

                    output.invalid_arguments(result.invalid_arguments());
                }
                TemplateResultKind::Search(result) => {
                    if let Some(templates) = result.templates() {
                        let matches = cache.search_template_names(templates);

                        output.exact(matches.exact());
                        output.closest(matches.closest());
                    }
                }
                TemplateResultKind::Preview(result) => {
                    if let Some(templates) = result.templates() {
                        let matches = cache.search_template_names(templates);

                        output.exact(matches.exact());
                        output.closest(matches.closest());

                        let preview_template_names = matches
                            .exact()
                            .into_iter()
                            .chain(matches.closest().into_iter().map(|elem| elem.closest()))
                            .collect::<Vec<_>>();

                        output.all_filtered_techs(cache.filter_templates(preview_template_names));
                    }
                }
                TemplateResultKind::Append(result) => {
                    if let Some(templates) = result.templates() {
                        let matches = cache.search_template_names(templates);

                        let input = Input::new();

                        let closest = matches.closest();

                        let exact = matches.exact().into_iter();

                        let names = input
                            .validate_closest_names(closest.clone())
                            .into_iter()
                            .chain(exact.clone())
                            .collect::<Vec<_>>();

                        match closest.len() + exact.len() == names.len()
                            || input.confirm_to_proceed()
                        {
                            false => output.terminated("Append"),
                            true => {
                                let out_dir = get_outdir(result.outdir());
                                output.appending(out_dir.clone());

                                cache.append_gitignore_file(names, out_dir);

                                output.appended();
                            }
                        };
                    }

                    output.invalid_arguments(result.invalid_arguments());
                }
                TemplateResultKind::Generate(result) => {
                    if let Some(templates) = result.templates() {
                        let out_dir = get_outdir(result.outdir());
                        let already_has_destination_file =
                            cache.already_has_destination_file(out_dir.clone());

                        match already_has_destination_file && !result.force() {
                            true => output.already_has_destination_file(out_dir),
                            false => {
                                let matches = cache.search_template_names(templates);

                                let input = Input::new();

                                let closest = matches.closest();

                                let exact = matches.exact().into_iter();

                                let names = input
                                    .validate_closest_names(closest.clone())
                                    .into_iter()
                                    .chain(exact.clone())
                                    .collect::<Vec<_>>();

                                match closest.len() + exact.len() == names.len() {
                                    false => output.terminated("Generate"),
                                    true => {
                                        match already_has_destination_file {
                                            true => output.overriding(out_dir.clone()),
                                            false => output.generating(out_dir.clone()),
                                        };

                                        cache.generate_gitignore_file(names, out_dir);

                                        match already_has_destination_file {
                                            true => output.overrided(),
                                            false => output.generated(),
                                        };
                                    }
                                };
                            }
                        };
                    }

                    output.invalid_arguments(result.invalid_arguments());
                }
            }
        }
    };
}
