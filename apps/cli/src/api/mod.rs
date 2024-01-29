pub mod response;

use std::error::Error;

use crate::types::Str;

use self::response::{
    LatestCommittedTimeResponse, LatestCommittedTimeResult, TemplatesResponse, TemplatesResult,
};

#[derive(Debug)]
pub struct GitignoredApi {
    api: Str,
}

impl GitignoredApi {
    pub const fn new(api: Str) -> Self {
        GitignoredApi { api }
    }

    fn result_templates(&self) -> Result<TemplatesResponse, Box<dyn Error>> {
        Ok(reqwest::blocking::get(format!("{}/templates", self.api))?
            .json::<TemplatesResponse>()?)
    }

    pub fn templates(&self) -> TemplatesResult {
        match self.result_templates() {
            Err(error) => panic!("Error: {}", error),
            Ok(response) => TemplatesResult::from_response(response),
        }
    }

    fn result_latest_committed_time(&self) -> Result<LatestCommittedTimeResponse, Box<dyn Error>> {
        Ok(
            reqwest::blocking::get(format!("{}/latest-committed-time", self.api))?
                .json::<LatestCommittedTimeResponse>()?,
        )
    }

    pub fn latest_committed_time(&self) -> LatestCommittedTimeResult {
        match self.result_latest_committed_time() {
            Err(error) => panic!("Error: {}", error),
            Ok(response) => LatestCommittedTimeResult::from_response(response),
        }
    }
}

#[cfg(test)]
mod tests {
    use chrono::{Local, Utc};

    use crate::{api::GitignoredApi, env};
    use env::Env;

    #[test]
    fn it_should_call_gitignored_template() {
        let api = GitignoredApi::new(Env::API);

        assert!(api.templates().templates().unwrap().data().len() > 200);
    }

    #[test]
    #[should_panic]
    fn it_should_panic_for_failing_to_call_gitignored_template() {
        GitignoredApi::new("").templates();
    }

    #[test]
    fn it_should_call_gitignored_latest_committed_time() {
        let api = GitignoredApi::new(Env::API);

        let commit_time = api
            .latest_committed_time()
            .latest_committed_time()
            .unwrap()
            .data()
            .to_owned();

        let utc = Utc::now();
        let local = Local::now();

        assert!(commit_time < utc);
        assert!(commit_time < local);
    }

    #[test]
    #[should_panic]
    fn it_should_panic_for_failing_to_call_gitignored_latest_committed_time() {
        GitignoredApi::new("").latest_committed_time();
    }
}
