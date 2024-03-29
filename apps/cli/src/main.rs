mod api;
mod cache;
mod cli;
mod env;
mod input;
mod output;
mod types;
mod uninstaller;
mod util;

use api::GitignoredApi;
use cache::Cache;
use chrono::{DateTime, Utc};
use cli::{
    keywords::{
        command::CommandResultKind, options::OptionsResultKind,
        subcommand::template::TemplateResultKind,
    },
    Cli,
};
use directories::ProjectDirs;
use env::Env;
use input::Input;
use output::Output;
use uninstaller::Uninstaller;

use std::env as stdenv;

fn main() {
    if cfg!(debug_assertions) {
        stdenv::set_var("RUST_BACKTRACE", "1");
    }

    let cli = Cli::new();

    let argument: Vec<String> = stdenv::args().collect();

    let argument = argument.into_iter().skip(1).collect::<Vec<_>>().join(" ");

    let output = Output::new();

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

    let uninstaller = Uninstaller::new();

    let templates = || api.templates().templates().unwrap().data().to_owned();

    let current_time = DateTime::parse_from_rfc3339(Utc::now().to_rfc3339().as_str()).unwrap();

    let latest_committed_time = api
        .latest_committed_time()
        .latest_committed_time()
        .unwrap()
        .data()
        .to_owned();

    if !cache.has_been_created() {
        output.generating_cache();

        cache.generate(current_time, latest_committed_time, templates());

        output.generated_cache();
    }

    if cache.should_update(latest_committed_time) && cache.should_remind(current_time) {
        output.update_available();
        cache.update_last_remind_time(current_time);
    }

    match cli.keywords().options().parse_to_result(
        argument.clone(),
        format!(
            "{}{}{}{}",
            cli.pre_basic_info(),
            cli.keywords().command().description(),
            cli.keywords().options().description(),
            cli.keywords().subcommand().template().description(),
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
            match cli.keywords().command().parse_to_result(argument.clone()) {
                CommandResultKind::Uninstall(result) => {
                    output.removing_cache();
                    cache.remove();
                    output.removed_cache();

                    output.uninstalling();
                    uninstaller.uninstall();
                    output.uninstalled();

                    output.invalid_arguments(result.invalid_arguments());
                }
                CommandResultKind::OpenLink(result) => {
                    let url = result
                        .value()
                        .unwrap_or_else(|| panic!("Should have an URL to open"));

                    output.normal(url.clone());

                    output.invalid_arguments(result.invalid_arguments());

                    webbrowser::open(url.as_str()).unwrap();
                }
                CommandResultKind::Never => {
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
                            match cache.has_been_created()
                                && cache.latest_committed_time() == latest_committed_time
                            {
                                true => output.already_up_to_date(),
                                false => {
                                    output.show_commit_time_differences(
                                        cache.latest_committed_time(),
                                        latest_committed_time,
                                    );
                                    output.updating();
                                    cache.generate(
                                        current_time,
                                        latest_committed_time,
                                        templates(),
                                    );
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

                                output.all_filtered_techs(
                                    cache.filter_templates(preview_template_names),
                                );
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

                                        match closest.len() + exact.len() == names.len()
                                            || input.confirm_to_proceed()
                                        {
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
            }
        }
    };
}
