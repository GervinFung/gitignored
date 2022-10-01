use chrono::DateTime;
use std::{
    fs::{read_to_string, File},
    io::Write,
    panic,
};

use crate::util::{
    Date, LastRemindTimeInDate, LastRemindTimeInString, LatestCommitTimeInDate,
    LatestCommitTimeInString,
};

pub struct Time {
    commit_time_file_path: String,
    last_remind_time_file_path: String,
}

impl Time {
    pub fn new(cache: String) -> Self {
        Time {
            commit_time_file_path: format!("{}/{}", cache, "latestCommitTime.json"),
            last_remind_time_file_path: format!("{}/{}", cache, "remindUpdate.json"),
        }
    }

    pub fn should_update(&self, latest_commit_time: Date) -> bool {
        self.latest_commit_time() < latest_commit_time
    }

    pub fn should_remind(&self, current_time: Date) -> bool {
        (current_time - self.last_remind_time()).num_seconds() > 86400
    }

    fn last_remind_time(&self) -> Date {
        let file_path = self.last_remind_time_file_path.clone();
        let latest_commit_time_json = read_to_string(file_path.clone())
            .unwrap_or_else(|_| panic!("{} {}", "Unable to read from", file_path));
        let parsed: LastRemindTimeInString = serde_json::from_str(latest_commit_time_json.as_str())
            .unwrap_or_else(|_| {
                panic!(
                    "{} {}",
                    "Unable to parse last remind time as JSON from", latest_commit_time_json
                )
            });
        let commit_time_iso_format = parsed.latest_remind_time();
        DateTime::parse_from_rfc3339(&commit_time_iso_format).unwrap_or_else(|_| {
            panic!(
                "{} {}",
                "Unable to parse commit time as JSON from", commit_time_iso_format
            )
        })
    }

    pub fn update_last_remind_time(&self, last_remind_time: Date) -> Date {
        let file_path = self.last_remind_time_file_path.clone();
        let mut file = File::create(file_path.clone()).unwrap_or_else(|_| {
            panic!(
                "{} {}",
                "Unable to create last remind time cache file from", file_path
            )
        });
        let stringified =
            serde_json::to_string_pretty(&LastRemindTimeInDate::new(last_remind_time))
                .unwrap_or_else(|_| {
                    panic!(
                        "{} {}",
                        "Unable to stringify last remind time of", last_remind_time
                    )
                });
        file.write_all(stringified.as_bytes()).unwrap_or_else(|_| {
            panic!("{} {}", "Unable to write last remind time of", stringified)
        });
        self.last_remind_time()
    }

    pub fn latest_commit_time(&self) -> Date {
        let file_path = self.commit_time_file_path.clone();
        let latest_commit_time_json = read_to_string(file_path.clone())
            .unwrap_or_else(|_| panic!("{} {}", "Unable to read from", file_path));
        let parsed: LatestCommitTimeInString =
            serde_json::from_str(latest_commit_time_json.as_str()).unwrap_or_else(|_| {
                panic!(
                    "{} {}",
                    "Unable to parse latest commit time as JSON from", latest_commit_time_json
                )
            });
        let commit_time_iso_format = parsed.latest_commit_time();
        DateTime::parse_from_rfc3339(&commit_time_iso_format).unwrap_or_else(|_| {
            panic!(
                "{} {}",
                "Unable to parse commit time as JSON from", commit_time_iso_format
            )
        })
    }

    pub fn update_latest_commit_time(&self, commit_time: Date) -> Date {
        let file_path = self.commit_time_file_path.clone();
        let mut file = File::create(file_path.clone()).unwrap_or_else(|_| {
            panic!(
                "{} {}",
                "Unable to create latest commit time cache file from", file_path
            )
        });
        let stringified = serde_json::to_string_pretty(&LatestCommitTimeInDate::new(commit_time))
            .unwrap_or_else(|_| {
                panic!(
                    "{} {}",
                    "Unable to stringify latest commit time of", commit_time
                )
            });
        file.write_all(stringified.as_bytes()).unwrap_or_else(|_| {
            panic!(
                "{} {}",
                "Unable to write latest commit time of", stringified
            )
        });
        self.latest_commit_time()
    }
}
