use chrono::DateTime;
use serde::{Deserialize, Serialize};
use std::{
    fs::{read_to_string, File},
    io::Write,
    panic,
};

use crate::{api::response::LatestCommittedTimeResponseDto, types::Date};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct LastRemindTimeInString {
    lastRemindTime: String,
}

impl LastRemindTimeInString {
    pub fn latest_remind_time(&self) -> &String {
        &self.lastRemindTime
    }
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct LastRemindTimeInDate {
    lastRemindTime: Date,
}

impl LastRemindTimeInDate {
    #[allow(non_snake_case)]
    pub const fn new(lastRemindTime: Date) -> Self {
        LastRemindTimeInDate { lastRemindTime }
    }
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct LatestCommittedTimeDto {
    latestCommittedTime: Date,
}

#[derive(Debug, Clone)]
pub struct TimeCache {
    latest_committed_time_file_path: String,
    last_remind_time_file_path: String,
}

impl TimeCache {
    pub fn new(cache: String) -> Self {
        TimeCache {
            latest_committed_time_file_path: format!("{}/latest-committed-time.json", cache),
            last_remind_time_file_path: format!("{}/remind-update.json", cache),
        }
    }

    fn latest_committed_time_file_path(&self) -> &String {
        &self.latest_committed_time_file_path
    }

    fn last_remind_time_file_path(&self) -> &String {
        &self.last_remind_time_file_path
    }

    pub fn should_update(&self, latest_committed_time: Date) -> bool {
        self.latest_committed_time() < latest_committed_time
    }

    pub fn should_remind(&self, current_time: Date) -> bool {
        (current_time - self.last_remind_time()).num_seconds() > 24 * 60 * 60
    }

    fn last_remind_time(&self) -> Date {
        let file_path = self.last_remind_time_file_path();

        let latest_committed_time_json = read_to_string(file_path.clone())
            .unwrap_or_else(|_| panic!("Unable to read from {}", file_path));

        let parsed: LastRemindTimeInString =
            serde_json::from_str(latest_committed_time_json.as_str()).unwrap_or_else(|_| {
                panic!(
                    "Unable to parse last remind time as JSON from {}",
                    latest_committed_time_json
                )
            });

        let commit_time_iso_format = parsed.latest_remind_time();

        DateTime::parse_from_rfc3339(commit_time_iso_format).unwrap_or_else(|_| {
            panic!(
                "Unable to parse commit time as JSON from {}",
                commit_time_iso_format
            )
        })
    }

    pub fn update_last_remind_time(&self, last_remind_time: Date) -> Date {
        let file_path = self.last_remind_time_file_path();

        let mut file = File::create(file_path.clone()).unwrap_or_else(|_| {
            panic!(
                "Unable to create last remind time cache file from {}",
                file_path
            )
        });

        let stringified =
            serde_json::to_string_pretty(&LastRemindTimeInDate::new(last_remind_time))
                .unwrap_or_else(|_| {
                    panic!(
                        "Unable to stringify last remind time of {}",
                        last_remind_time
                    )
                });

        file.write_all(stringified.as_bytes())
            .unwrap_or_else(|_| panic!("Unable to write last remind time of {}", stringified));

        self.last_remind_time()
    }

    pub fn latest_committed_time(&self) -> Date {
        let file_path = self.latest_committed_time_file_path();

        let latest_committed_time_json = read_to_string(file_path.clone())
            .unwrap_or_else(|_| panic!("Unable to read from {}", file_path));

        let parsed: LatestCommittedTimeResponseDto =
            serde_json::from_str(latest_committed_time_json.as_str()).unwrap_or_else(|_| {
                panic!(
                    "Unable to parse latest commit time as JSON from {}",
                    latest_committed_time_json
                )
            });

        parsed.to_date()
    }

    pub fn update_latest_committed_time(&self, commit_time: Date) -> Date {
        let file_path = self.latest_committed_time_file_path();

        let mut file = File::create(file_path.clone()).unwrap_or_else(|_| {
            panic!(
                "Unable to create latest commit time cache file from {}",
                file_path
            )
        });

        let stringified = serde_json::to_string_pretty(&LatestCommittedTimeDto {
            latestCommittedTime: commit_time,
        })
        .unwrap_or_else(|_| panic!("Unable to stringify latest commit time of {}", commit_time));

        file.write_all(stringified.as_bytes())
            .unwrap_or_else(|_| panic!("Unable to write latest commit time of {}", stringified));

        self.latest_committed_time()
    }
}
