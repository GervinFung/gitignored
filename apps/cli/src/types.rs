use chrono::{DateTime, FixedOffset};

pub type VecString = Vec<String>;

pub type OptionalVecString = Option<VecString>;

pub type Date = DateTime<FixedOffset>;

pub type Str = &'static str;
