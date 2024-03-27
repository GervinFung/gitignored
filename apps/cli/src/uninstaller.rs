use std::process::Command;

pub struct Uninstaller {}

impl Uninstaller {
    pub fn new() -> Self {
        Uninstaller {}
    }

    pub fn uninstall(&self) {
        Command::new("cargo")
            .arg("uninstall")
            .arg("gitignored-cli")
            .spawn()
            .unwrap_or_else(|error| {
                panic!("Failed to uninstall gitignored-cli: {}", error.to_string())
            });
    }
}
