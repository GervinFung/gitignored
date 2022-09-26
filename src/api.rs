use crate::util::{
    Date, GitIgnoreNameAndContentList, LatestCommitTimeInString, NameAndContentList, Str,
};
use chrono::DateTime;

#[derive(Debug)]
pub struct GitIgnoredApi {
    api: Str,
}

impl GitIgnoredApi {
    pub const fn new(api: Str) -> Self {
        GitIgnoredApi { api }
    }
    fn result_name_and_content_list(
        &self,
    ) -> Result<GitIgnoreNameAndContentList, Box<dyn std::error::Error>> {
        Ok(
            reqwest::blocking::get(format!("{}{}", self.api, "/api/names-and-contents"))?
                .json::<GitIgnoreNameAndContentList>()?,
        )
    }
    pub fn name_and_content_list(&self) -> NameAndContentList {
        self.result_name_and_content_list()
            .unwrap_or_else(|_| panic!("Unable to get the name and content list from api"))
            .gitignored_name_and_content_list()
    }
    fn result_latest_commit_time(
        &self,
    ) -> Result<LatestCommitTimeInString, Box<dyn std::error::Error>> {
        Ok(
            reqwest::blocking::get(format!("{}{}", self.api, "/api/commit-time"))?
                .json::<LatestCommitTimeInString>()?,
        )
    }
    pub fn latest_commit_time(&self) -> Date {
        let commit_time_iso_format = self
            .result_latest_commit_time()
            .unwrap_or_else(|_| panic!("Unable to get the latest commit time from api"))
            .latest_commit_time();
        DateTime::parse_from_rfc3339(&commit_time_iso_format)
            .unwrap_or_else(|_| panic!("{} {}", "Unable to parse", commit_time_iso_format))
    }
}

#[cfg(test)]
mod tests {
    use chrono::{Local, Utc};

    use crate::{api, env};
    use env::Env;

    #[test]
    fn it_should_call_gitignored_name_and_content() {
        let api = api::GitIgnoredApi::new(Env::API);
        let names_and_id_list = api.name_and_content_list();
        assert!(names_and_id_list.len() > 200);
    }

    #[test]
    #[should_panic = "Unable to get the name and content list from api"]
    fn it_should_panic_for_failing_to_call_gitignored_name_and_content() {
        api::GitIgnoredApi::new("").name_and_content_list();
    }

    #[test]
    fn it_should_call_gitignored_latest_commit_time() {
        let api = api::GitIgnoredApi::new(Env::API);
        let commit_time = api.latest_commit_time();

        let utc = Utc::now();
        let local = Local::now();

        assert!(commit_time < utc);
        assert!(commit_time < local);
    }

    #[test]
    #[should_panic = "Unable to get the latest commit time from api"]
    fn it_should_panic_for_failing_to_call_gitignored_latest_commit_time() {
        api::GitIgnoredApi::new("").latest_commit_time();
    }
}
