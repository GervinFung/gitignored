use chrono::DateTime;
use std::{
    fs::{self, create_dir_all, read_to_string, File},
    io::Write,
    panic,
};
use strsim::normalized_levenshtein;

use std::path::Path;

use crate::util::{
    Date, GitIgnoreNameAndContentList, LastRemindTimeInDate, LastRemindTimeInString,
    LatestCommitTimeInDate, LatestCommitTimeInString, NameAndContentList, NameList,
};

#[derive(Debug)]
struct Levenshtein {
    score: f64,
    original: String,
    closest: String,
}

impl Levenshtein {
    pub const fn new(score: f64, original: String, closest: String) -> Self {
        Levenshtein {
            score,
            original,
            closest,
        }
    }
}

#[derive(Clone, Debug)]
pub struct Match {
    original: String,
    closest: String,
}

impl Match {
    pub const fn new(original: String, closest: String) -> Self {
        Match { original, closest }
    }
    pub fn original(&self) -> String {
        self.original.clone()
    }
    pub fn closest(&self) -> String {
        self.closest.clone()
    }
}

pub type Matches = Vec<Match>;

#[derive(Debug)]
pub struct SearchResult {
    exact: NameList,
    closest: Matches,
}

impl SearchResult {
    pub const fn new(exact: NameList, closest: Matches) -> Self {
        SearchResult { exact, closest }
    }
    pub fn exact(&self) -> NameList {
        self.exact.clone()
    }
    pub fn closest(&self) -> Matches {
        self.closest.clone()
    }
}

pub struct Cache {
    cache: String,
    commit_time_file_path: String,
    name_and_content_list_file_path: String,
    last_remind_time_file_path: String,
}

impl Cache {
    pub fn new(cache: String) -> Self {
        Cache {
            cache: cache.clone(),
            commit_time_file_path: format!("{}/{}", cache, "latestCommitTime.json"),
            name_and_content_list_file_path: format!(
                "{}/{}",
                cache, "gitIgnoreNamesAndContents.json"
            ),
            last_remind_time_file_path: format!("{}/{}", cache, "remindUpdate.json"),
        }
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
        self.latest_commit_time() < latest_commit_time
    }
    pub fn should_remind(&self, current_time: Date) -> bool {
        (current_time - self.last_remind_time()).num_seconds() > 86400
    }
    pub fn last_remind_time(&self) -> Date {
        let file_path = self.last_remind_time_file_path.clone();
        let latest_commit_time_json = read_to_string(file_path.clone())
            .unwrap_or_else(|_| panic!("{}{}", "Unable to read from ", file_path));
        let parsed: LastRemindTimeInString = serde_json::from_str(latest_commit_time_json.as_str())
            .unwrap_or_else(|_| {
                panic!(
                    "{}{}",
                    "Unable to parse last remind time as JSON from ", latest_commit_time_json
                )
            });
        let commit_time_iso_format = parsed.latest_remind_time();
        DateTime::parse_from_rfc3339(&commit_time_iso_format).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to parse commit time as JSON from ", commit_time_iso_format
            )
        })
    }
    pub fn update_last_remind_time(&self, last_remind_time: Date) -> Date {
        let file_path = self.last_remind_time_file_path.clone();
        let mut file = File::create(file_path.clone()).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to create last remind time cache file from ", file_path
            )
        });
        let stringified =
            serde_json::to_string_pretty(&LastRemindTimeInDate::new(last_remind_time))
                .unwrap_or_else(|_| {
                    panic!(
                        "{}{}",
                        "Unable to stringify last remind time of ", last_remind_time
                    )
                });
        file.write_all(stringified.as_bytes()).unwrap_or_else(|_| {
            panic!("{}{}", "Unable to write last remind time of ", stringified)
        });
        self.last_remind_time()
    }
    pub fn latest_commit_time(&self) -> Date {
        let file_path = self.commit_time_file_path.clone();
        let latest_commit_time_json = read_to_string(file_path.clone())
            .unwrap_or_else(|_| panic!("{}{}", "Unable to read from ", file_path));
        let parsed: LatestCommitTimeInString =
            serde_json::from_str(latest_commit_time_json.as_str()).unwrap_or_else(|_| {
                panic!(
                    "{}{}",
                    "Unable to parse latest commit time as JSON from ", latest_commit_time_json
                )
            });
        let commit_time_iso_format = parsed.latest_commit_time();
        DateTime::parse_from_rfc3339(&commit_time_iso_format).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to parse commit time as JSON from ", commit_time_iso_format
            )
        })
    }
    fn update_latest_commit_time(&self, commit_time: Date) -> Date {
        let file_path = self.commit_time_file_path.clone();
        let mut file = File::create(file_path.clone()).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to create latest commit time cache file from ", file_path
            )
        });
        let stringified = serde_json::to_string_pretty(&LatestCommitTimeInDate::new(commit_time))
            .unwrap_or_else(|_| {
                panic!(
                    "{}{}",
                    "Unable to stringify latest commit time of ", commit_time
                )
            });
        file.write_all(stringified.as_bytes()).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to write latest commit time of ", stringified
            )
        });
        self.latest_commit_time()
    }
    pub fn name_and_content_list(&self) -> NameAndContentList {
        let file_path = self.name_and_content_list_file_path.clone();
        let stringified_name_and_content_list = read_to_string(file_path.clone())
            .unwrap_or_else(|_| panic!("{}{}", "Unable to read from ", file_path));
        let parsed: GitIgnoreNameAndContentList =
            serde_json::from_str(stringified_name_and_content_list.as_str()).unwrap_or_else(|_| {
                panic!(
                    "{}{}",
                    "Unable to parse as JSON from ", stringified_name_and_content_list
                )
            });
        parsed.gitignored_name_and_content_list()
    }
    fn update_name_and_content_list(
        &self,
        name_and_content_list: NameAndContentList,
    ) -> NameAndContentList {
        let file_path = self.name_and_content_list_file_path.clone();
        let mut file = File::create(file_path.clone()).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to create name and content list cache file from ", file_path
            )
        });
        let stringified = serde_json::to_string_pretty(&GitIgnoreNameAndContentList::new(
            name_and_content_list.clone(),
        ))
        .unwrap_or_else(|_| {
            panic!(
                "{}{:?}",
                "Unable to stringify name and content list of ", name_and_content_list
            )
        });
        file.write_all(stringified.as_bytes()).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to write name and content list of ", stringified
            )
        });
        self.name_and_content_list()
    }
    pub fn name_list(&self) -> NameList {
        self.name_and_content_list()
            .into_iter()
            .map(|name_and_content| name_and_content.name())
            .collect::<Vec<_>>()
    }
    pub fn filter_name_and_content_list(&self, name_list: Vec<String>) -> NameAndContentList {
        let name_list = name_list
            .iter()
            .map(|name| name.to_uppercase())
            .collect::<Vec<_>>();
        self.name_and_content_list()
            .into_iter()
            .filter(|name_and_content| name_list.contains(&name_and_content.name().to_uppercase()))
            .collect::<Vec<_>>()
    }
    fn generate_content(&self, name_list: NameList) -> String {
        format!(
            "{}{}",
            "Generated by gitignore-cli. Templates are taken from https://gitignored.gtsb.io/\n\n",
            self.filter_name_and_content_list(name_list)
                .into_iter()
                .map(|name_and_content| {
                    format!(
                        "{}{}{}{}",
                        "### The gitignore of ",
                        name_and_content.name().to_uppercase(),
                        "\n",
                        name_and_content.content()
                    )
                })
                .collect::<Vec<_>>()
                .join("\n\n")
        )
    }
    fn generate_gitignore_outdir(&self, file_name: String) {
        let split = file_name.split('/').collect::<Vec<_>>();
        let len = split.len();
        fs::create_dir_all(split.split_at(len - 1).0.join("/"))
            .unwrap_or_else(|_| panic!("{}{}", "Unable to create outdir from ", file_name.clone()))
    }
    pub fn already_has_destination_file(&self, file_name: String) -> bool {
        Path::new(file_name.as_str()).exists()
    }
    pub fn generate_gitignore_file(&self, name_list: NameList, file_name: String) {
        self.generate_gitignore_outdir(file_name.clone());
        let mut file = File::create(file_name.clone()).unwrap_or_else(|_| {
            panic!(
                "{}{}",
                "Unable to create .gitignore file from ",
                file_name.clone()
            )
        });
        file.write_all(self.generate_content(name_list).as_bytes())
            .unwrap_or_else(|_| {
                panic!(
                    "{}{}",
                    "Unable to write generated .gitignore to ", file_name
                )
            })
    }
    pub fn append_gitignore_file(&self, name_list: NameList, file_name: String) {
        self.generate_gitignore_outdir(file_name.clone());
        let gitignore = self.generate_content(name_list);
        let is_exist = self.already_has_destination_file(file_name.clone());
        let mut file = fs::OpenOptions::new()
            .write(true)
            .append(is_exist)
            .create(!is_exist)
            .open(file_name.clone())
            .unwrap_or_else(|_| {
                panic!("{}{}", "Unable to open/create file of ", file_name.clone())
            });
        if !is_exist {
            file.write_all(gitignore.as_bytes()).unwrap_or_else(|_| {
                panic!(
                    "{}{}",
                    "Unable to write generated .gitignore content to ", file_name
                )
            })
        } else {
            file.write_all(
                format!(
                    "{}{}",
                    "\nAnything below is generated by gitignored-cli\n", gitignore
                )
                .as_bytes(),
            )
            .unwrap_or_else(|_| {
                panic!(
                    "{}{}",
                    "Unable to append generated .gitignore content to ", file_name
                )
            })
        }
    }
    pub fn search_name_list(&self, name_list: Vec<&str>) -> SearchResult {
        let gitignored_name_list = self.name_list();
        let matches = name_list
            .iter()
            .map(|name| {
                let levenshtein = gitignored_name_list.iter().fold(
                    Levenshtein::new(0.0, name.to_string(), "".to_string()),
                    |prev, curr| {
                        if prev.score == 1.0 {
                            return prev;
                        }
                        let score = normalized_levenshtein(name, curr);
                        if score <= prev.score {
                            return prev;
                        }
                        Levenshtein::new(score, prev.original, curr.to_string())
                    },
                );
                Match::new(levenshtein.original, levenshtein.closest)
            })
            .collect::<Vec<_>>();
        SearchResult::new(
            matches
                .iter()
                .filter(|matches| {
                    matches.original().to_uppercase() == matches.closest().to_uppercase()
                })
                .map(|matches| matches.original())
                .collect::<Vec<_>>(),
            matches
                .into_iter()
                .filter(|matches| {
                    matches.original().to_uppercase() != matches.closest().to_uppercase()
                })
                .collect::<Vec<_>>(),
        )
    }
}

#[cfg(test)]
mod tests {

    use std::{fs, path::Path};

    use crate::{cache, util::NameAndContent};
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
        let cache = cache::Cache::new(name.clone());
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
        assert!(latest_commit_time == cache.latest_commit_time());
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
            "Generated by gitignore-cli. Templates are taken from https://gitignored.gtsb.io/\n\n### The gitignore of JAVA\nStream API".to_string(),
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

        fs::remove_dir_all(name)
            .unwrap_or_else(|_| panic!("Unable to remove cache from previous test"));
    }
}
