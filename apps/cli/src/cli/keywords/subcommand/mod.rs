use self::template::Template;

pub mod template;

#[derive(Debug, Clone)]
pub struct Subcommand {
    template: Template,
}

impl Subcommand {
    pub fn new() -> Self {
        Subcommand {
            template: Template::new(),
        }
    }

    pub fn template(&self) -> &Template {
        &self.template
    }
}
