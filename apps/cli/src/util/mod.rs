use self::string::StringUtil;

mod string;

pub struct Util {
    string: StringUtil,
}

impl Util {
    pub fn new() -> Util {
        Util {
            string: StringUtil::new(),
        }
    }

    pub fn string(&self) -> &StringUtil {
        &self.string
    }
}
