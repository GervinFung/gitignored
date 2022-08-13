use input::Input;

mod api;
mod cache;
mod cli;
mod env;
mod input;
mod output;
mod util;

fn main() {
    let env = env::Env::new();

    let api = api::GitIgnoredApi::new(env.api());
    let cache = cache::Cache::new(".cache");
    let cli = cli::Cli::new();
    let args_matcher = cli.args_matches();
    let output = output::Output::new();

    if !cache.has_been_created() {
        cache.generate(api.latest_commit_time(), api.name_and_content_list());
    }

    let get_outdir = || {
        let current_dir =
            std::env::current_dir().unwrap_or_else(|_| panic!("Unable to get current directory"));
        let outdir = args_matcher.value_of(cli.outdir()).unwrap_or("");
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
            env.file()
        )
    };

    if args_matcher.is_present(cli.list()) {
        output.all_names_separated_by_first_character(
            cache.name_list(),
            args_matcher
                .value_of(cli.width())
                .unwrap_or("4")
                .parse::<u8>()
                .unwrap_or_else(|_| panic!("Unable to parse as u8 for tabular column width")),
        );
    } else if args_matcher.is_present(cli.search()) {
        let matches = cache.search_name_list(
            args_matcher
                .values_of(cli.search())
                .clone()
                .unwrap_or_else(|| panic!("Unable to get arguments from '-s'"))
                .collect::<Vec<_>>(),
        );
        output.exact(matches.exact());
        output.closest(matches.closest());
    } else if args_matcher.is_present(cli.preview()) {
        let matches = cache.search_name_list(
            args_matcher
                .values_of(cli.preview())
                .clone()
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
    } else if args_matcher.is_present(cli.generate()) {
        let matches = cache.search_name_list(
            args_matcher
                .values_of(cli.generate())
                .clone()
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
            let out_dir = get_outdir();
            output.generating(out_dir.clone());
            cache.generate_gitignore_file(names, out_dir);
            output.generated();
        } else {
            output.terminated("Generate");
        }
    } else if args_matcher.is_present(cli.append()) {
        let matches = cache.search_name_list(
            args_matcher
                .values_of(cli.append())
                .clone()
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
    } else if args_matcher.is_present(cli.update()) && cache.has_been_created() {
        let latest_commit_time = api.latest_commit_time();
        let cached_commit_time = cache.latest_commit_time();
        if cached_commit_time == latest_commit_time {
            output.already_up_to_date();
        } else {
            output.show_commit_time_differences(cached_commit_time, latest_commit_time);
            output.updating();
            cache.generate(latest_commit_time, api.name_and_content_list());
            output.updated();
        }
    }
}
