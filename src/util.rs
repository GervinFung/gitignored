#![allow(non_snake_case)]

use chrono::{DateTime, FixedOffset};
use serde::{Deserialize, Serialize};

pub type Str = &'static str;

// commit time
#[derive(Serialize, Deserialize, Debug)]
pub struct LatestCommitTimeInDate {
    latestCommitTime: Date,
}

impl LatestCommitTimeInDate {
    pub const fn new(latestCommitTime: Date) -> Self {
        LatestCommitTimeInDate { latestCommitTime }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LatestCommitTimeInString {
    latestCommitTime: String,
}

impl LatestCommitTimeInString {
    pub fn latest_commit_time(&self) -> String {
        self.latestCommitTime.clone()
    }
}

// gitignore
pub type NameAndContentList = Vec<NameAndContent>;
pub type NameList = Vec<String>;

#[derive(Serialize, Deserialize, Debug)]
pub struct GitIgnoreNameList {
    gitIgnoreNames: NameList,
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct NameAndContent {
    name: String,
    content: String,
}

impl NameAndContent {
    // this is used in test only
    #[allow(dead_code)]
    pub const fn new(name: String, content: String) -> Self {
        NameAndContent { name, content }
    }

    pub fn name(&self) -> String {
        self.name.clone()
    }

    pub fn content(&self) -> String {
        self.content.clone()
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GitIgnoreNameAndContentList {
    gitIgnoreNamesAndContents: NameAndContentList,
}

impl GitIgnoreNameAndContentList {
    pub const fn new(gitIgnoreNamesAndContents: NameAndContentList) -> Self {
        GitIgnoreNameAndContentList {
            gitIgnoreNamesAndContents,
        }
    }

    pub fn gitignored_name_and_content_list(&self) -> NameAndContentList {
        self.gitIgnoreNamesAndContents.clone()
    }
}

pub type Date = DateTime<FixedOffset>;

// last remind time
#[derive(Serialize, Deserialize, Debug)]
pub struct LastRemindTimeInString {
    lastRemindTime: String,
}

impl LastRemindTimeInString {
    pub fn latest_remind_time(&self) -> String {
        self.lastRemindTime.clone()
    }
}
#[derive(Serialize, Deserialize, Debug)]
pub struct LastRemindTimeInDate {
    lastRemindTime: Date,
}

impl LastRemindTimeInDate {
    pub const fn new(lastRemindTime: Date) -> Self {
        LastRemindTimeInDate { lastRemindTime }
    }
}
