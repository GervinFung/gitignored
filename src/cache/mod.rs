pub mod templates;
pub mod time;

use std::{fs::create_dir_all, panic, path::Path};

use crate::util::{Date, NameAndContentList, NameList, Str};

use self::{
    templates::{SearchResult, Templates},
    time::Time,
};

pub struct Cache {
    api: Str,
    cache: String,
    time: Time,
    templates: Templates,
}

impl Cache {
    pub fn new(cache: String, api: Str) -> Self {
        Cache {
            api,
            cache: cache.clone(),
            time: Time::new(cache.clone()),
            templates: Templates::new(cache),
        }
    }

    #[cfg(test)]
    fn name_and_content_list(&self) -> NameAndContentList {
        self.templates.name_and_content_list()
    }

    #[cfg(test)]
    fn generate_content(&self, name_list: NameList) -> String {
        self.templates.generate_content(self.api, name_list)
    }

    #[cfg(test)]
    fn generate_gitignore_outdir(&self, file_name: String) {
        self.templates.generate_gitignore_outdir(file_name);
    }

    pub fn has_been_created(&self) -> bool {
        Path::new(&self.cache.clone()).exists()
    }
    pub fn generate(&self, commit_time: Date, name_and_content_list: NameAndContentList) {
        create_dir_all(self.cache.clone())
            .unwrap_or_else(|_| panic!("Unable to create cache directory"));
        self.update_latest_commit_time(commit_time);
        self.update_name_and_content_list(name_and_content_list);
    }

    pub fn should_update(&self, latest_commit_time: Date) -> bool {
        self.time.should_update(latest_commit_time)
    }

    pub fn should_remind(&self, current_time: Date) -> bool {
        self.time.should_remind(current_time)
    }

    pub fn update_last_remind_time(&self, last_remind_time: Date) -> Date {
        self.time.update_last_remind_time(last_remind_time)
    }

    pub fn latest_commit_time(&self) -> Date {
        self.time.latest_commit_time()
    }

    fn update_latest_commit_time(&self, commit_time: Date) -> Date {
        self.time.update_latest_commit_time(commit_time)
    }

    fn update_name_and_content_list(
        &self,
        name_and_content_list: NameAndContentList,
    ) -> NameAndContentList {
        self.templates
            .update_name_and_content_list(name_and_content_list)
    }

    pub fn name_list(&self) -> NameList {
        self.templates.name_list()
    }

    pub fn filter_name_and_content_list(&self, name_list: Vec<String>) -> NameAndContentList {
        self.templates.filter_name_and_content_list(name_list)
    }

    pub fn already_has_destination_file(&self, file_name: String) -> bool {
        self.templates.already_has_destination_file(file_name)
    }

    pub fn generate_gitignore_file(&self, name_list: NameList, file_name: String) {
        self.templates
            .generate_gitignore_file(self.api, name_list, file_name);
    }

    pub fn append_gitignore_file(&self, name_list: NameList, file_name: String) {
        self.templates
            .append_gitignore_file(self.api, name_list, file_name);
    }

    pub fn search_name_list(&self, name_list: Vec<&str>) -> SearchResult {
        self.templates.search_name_list(name_list)
    }
}

#[cfg(test)]
mod tests {

    use std::{fs, path::Path};

    use crate::{cache, env::Env, util::NameAndContent};
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
        let latest_commit_time = DateTime::parse_from_rfc3339("2022-05-10T17:15:30+00:00").unwrap();
        let name_and_content_list = [NameAndContent::new(
            "Python".to_string(),
            "Everything".to_string(),
        )]
        .to_vec();

        // before creating cache
        assert!(!cache.has_been_created());
        // create
        cache.generate(latest_commit_time, name_and_content_list.clone());
        // after creating cache
        assert!(cache.has_been_created());
        assert!(!cache.should_update(latest_commit_time));
        assert_eq!(latest_commit_time, cache.latest_commit_time());

        let cached_name_and_content_list = cache.name_and_content_list();
        assert_eq!(cached_name_and_content_list, name_and_content_list);

        // update
        let latest_commit_time = DateTime::parse_from_rfc3339("2022-05-10T17:15:40+00:00").unwrap();
        assert!(latest_commit_time == cache.update_latest_commit_time(latest_commit_time));
        let name_and_content_list = [
            NameAndContent::new("Java".to_string(), "Stream API".to_string()),
            NameAndContent::new("Haskell".to_string(), "Monad".to_string()),
        ]
        .to_vec();
        assert_eq!(
            name_and_content_list,
            cache.update_name_and_content_list(name_and_content_list.clone())
        );
        // names only
        assert_eq!(["Java", "Haskell"].to_vec(), cache.name_list());
        // filtered name and content
        assert_eq!(
            name_and_content_list[1],
            cache.filter_name_and_content_list(["Haskell".to_string()].to_vec())[0]
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
        let searched_name_list = cache.search_name_list(["Java", "Python"].to_vec());
        assert_eq!(["Java"].to_vec(), searched_name_list.exact());
        // will always return closest name based on highest score
        assert!(!searched_name_list.closest().is_empty());
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
