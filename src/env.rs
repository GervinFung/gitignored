use crate::util::Str;

#[derive(Debug)]
pub struct Env {
    api: Str,
    file: Str,
}

impl Env {
    pub const fn new() -> Self {
        Env {
            api: "https://gitignored.gtsb.io",
            file: ".gitignore",
        }
    }
    pub const fn api(&self) -> Str {
        self.api
    }
    pub const fn file(&self) -> Str {
        self.file
    }
}
