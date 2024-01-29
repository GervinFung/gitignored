pub mod templates;
pub mod time;

use crate::api::response::{TemplateNames, Templates};
use std::{fs, panic, path::Path};

use crate::types::{Date, Str};

use self::{
    templates::{SearchResult, TemplatesCache},
    time::TimeCache,
};

pub struct Cache {
    api: Str,
    cache: String,
    time: TimeCache,
    templates: TemplatesCache,
}

impl Cache {
    pub fn new(cache: String, api: Str) -> Self {
        Cache {
            api,
            cache: cache.clone(),
            time: TimeCache::new(cache.clone()),
            templates: TemplatesCache::new(cache),
        }
    }

    #[cfg(test)]
    fn templates(&self) -> Templates {
        self.templates.templates()
    }

    #[cfg(test)]
    fn generate_content(&self, template_names: TemplateNames) -> String {
        self.templates.generate_content(self.api, template_names)
    }

    #[cfg(test)]
    fn generate_gitignore_outdir(&self, file_name: String) {
        self.templates.generate_gitignore_outdir(file_name);
    }

    pub fn has_been_created(&self) -> bool {
        Path::new(&self.cache.clone()).exists()
    }

    pub fn generate(&self, commit_time: Date, templates: Templates) {
        fs::create_dir_all(self.cache.clone())
            .unwrap_or_else(|_| panic!("Unable to create cache directory"));

        self.update_latest_committed_time(commit_time);

        self.update_templates(templates);
    }

    pub fn should_update(&self, latest_committed_time: Date) -> bool {
        self.time.should_update(latest_committed_time)
    }

    pub fn should_remind(&self, current_time: Date) -> bool {
        self.time.should_remind(current_time)
    }

    pub fn update_last_remind_time(&self, last_remind_time: Date) -> Date {
        self.time.update_last_remind_time(last_remind_time)
    }

    pub fn latest_committed_time(&self) -> Date {
        self.time.latest_committed_time()
    }

    fn update_latest_committed_time(&self, commit_time: Date) -> Date {
        self.time.update_latest_committed_time(commit_time)
    }

    fn update_templates(&self, templates: Templates) -> Templates {
        self.templates.update_templates(templates)
    }

    pub fn template_names(&self) -> TemplateNames {
        self.templates.template_names()
    }

    pub fn filter_templates(&self, template_names: Vec<String>) -> Templates {
        self.templates.filter_templates(template_names)
    }

    pub fn already_has_destination_file(&self, file_name: String) -> bool {
        self.templates.already_has_destination_file(file_name)
    }

    pub fn generate_gitignore_file(&self, template_names: TemplateNames, file_name: String) {
        self.templates
            .generate_gitignore_file(self.api, template_names, file_name);
    }

    pub fn append_gitignore_file(&self, template_names: TemplateNames, file_name: String) {
        self.templates
            .append_gitignore_file(self.api, template_names, file_name);
    }

    pub fn search_template_names(&self, template_names: Vec<String>) -> SearchResult {
        self.templates.search_template_names(template_names)
    }
}

#[cfg(test)]
mod tests {

    use std::{fs, path::Path};

    use crate::{api::response::Template, cache, env::Env};
    use chrono::DateTime;
    use directories::ProjectDirs;

    #[test]
    fn it_should_create_and_update_cache() {
        let cache = ProjectDirs::from("", ".gitignored", "gitignored-test")
            .unwrap_or_else(|| panic!("Unable to create cache directory"));
        let name = String::from(
            cache
                .cache_dir()
                .to_str()
                .unwrap_or_else(|| panic!("Unable to create cache directory")),
        );
        let cache = cache::Cache::new(name.clone(), Env::API);
        let latest_committed_time =
            DateTime::parse_from_rfc3339("2022-05-10T17:15:30+00:00").unwrap();
        let templates = [Template::new(
            "Python".to_string(),
            "Everything".to_string(),
        )]
        .to_vec();

        // before creating cache
        assert!(!cache.has_been_created());
        // create
        cache.generate(latest_committed_time, templates.clone());
        // after creating cache
        assert!(cache.has_been_created());
        assert!(!cache.should_update(latest_committed_time));
        assert_eq!(latest_committed_time, cache.latest_committed_time());

        let cached_templates = cache.templates();
        assert_eq!(cached_templates, templates);

        // update
        let latest_committed_time =
            DateTime::parse_from_rfc3339("2022-05-10T17:15:40+00:00").unwrap();
        assert!(latest_committed_time == cache.update_latest_committed_time(latest_committed_time));
        let templates = [
            Template::new("Java".to_string(), "Stream API".to_string()),
            Template::new("Haskell".to_string(), "Monad".to_string()),
        ]
        .to_vec();
        assert_eq!(templates, cache.update_templates(templates.clone()));
        // names only
        assert_eq!(["Java", "Haskell"].to_vec(), cache.template_names());
        // filtered name and content
        assert_eq!(
            templates[1],
            cache.filter_templates(["Haskell".to_string()].to_vec())[0]
        );
        // generate content
        assert_eq!(
            format!(
                "{} {}\n\n{}",
                "Generated by gitignore-cli. Templates are taken from",
                cache.api,
                "### The gitignore of JAVA\nStream API"
            ),
            cache.generate_content(["Java".to_string()].to_vec())
        );

        // search name list
        let searched_template_names =
            cache.search_template_names(["Java".to_string(), "Python".to_string()].to_vec());
        assert_eq!(["Java"].to_vec(), searched_template_names.exact());
        // will always return closest name based on highest score
        assert!(!searched_template_names.closest().is_empty());
        // generate file
        cache.generate_gitignore_file(
            ["Java".to_string()].to_vec(),
            ".cache-test/.gitignore".to_string(),
        );
        assert!(Path::new(".cache-test/.gitignore").exists());
        // append file, auto create if not exists
        cache.generate_gitignore_file(
            ["Java".to_string()].to_vec(),
            ".cache-test/.gitignore-append".to_string(),
        );
        assert!(Path::new(".cache-test/.gitignore-append").exists());
        // append file, will not alter file name after append
        cache.generate_gitignore_file(
            ["Java".to_string()].to_vec(),
            ".cache-test/.gitignore-append".to_string(),
        );
        assert!(Path::new(".cache-test/.gitignore-append").exists());
        // test custom outdir folder
        cache.generate_gitignore_outdir("temp-test/test1/test2/test3".to_string());
        assert!(Path::new("temp-test/test1/test2").exists());

        // test last remind time
        let last_remind_time = DateTime::parse_from_rfc3339("2022-05-10T17:15:40+00:00").unwrap();
        assert_eq!(
            last_remind_time,
            cache.update_last_remind_time(last_remind_time)
        );
        assert!(
            cache.should_remind(DateTime::parse_from_rfc3339("2022-05-11T17:15:41+00:00").unwrap())
        );
        assert!(!cache
            .should_remind(DateTime::parse_from_rfc3339("2022-05-11T17:13:59+00:00").unwrap()));

        // clear cache for next test
        fs::remove_dir_all(name)
            .unwrap_or_else(|_| panic!("Unable to remove cache from previous test"));
    }
}
