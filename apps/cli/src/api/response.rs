use chrono::DateTime;
use serde::{Deserialize, Serialize};

use crate::types::Date;

pub type Templates = Vec<Template>;
pub type TemplateNames = Vec<String>;

pub type LatestCommittedTimeResponse = ApiResponse<LatestCommittedTimeResponseDto>;
pub type TemplatesResponse = ApiResponse<TemplatesResponseDto>;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FailedResult {
    reason: String,
}

impl FailedResult {
    fn reason(&self) -> String {
        self.reason.to_owned()
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SucceedResult<T> {
    data: T,
}

impl<T> SucceedResult<T> {
    pub fn data(&self) -> &T {
        &self.data
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum ApiResult<T> {
    Succeed(SucceedResult<T>),
    Failed(FailedResult),
}

impl<T> ApiResult<T> {
    pub fn unwrap(&self) -> &SucceedResult<T> {
        match self {
            ApiResult::Failed(failed) => panic!("Error: {}", failed.reason().clone()),
            ApiResult::Succeed(data) => data,
        }
    }
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "status")]
pub enum ApiResponse<T> {
    #[allow(non_camel_case_types)]
    failed { reason: String },
    #[allow(non_camel_case_types)]
    succeed { data: T },
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct LatestCommittedTimeResponseDto {
    latestCommittedTime: String,
}

impl LatestCommittedTimeResponseDto {
    pub fn to_date(&self) -> Date {
        DateTime::parse_from_rfc3339(&self.latestCommittedTime).unwrap()
    }
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug)]
pub struct LatestCommittedTimeResult {
    latestCommittedTime: ApiResult<Date>,
}

impl LatestCommittedTimeResult {
    pub fn from_response(response: ApiResponse<LatestCommittedTimeResponseDto>) -> Self {
        match response {
            ApiResponse::succeed { data } => LatestCommittedTimeResult::succeed(data),
            ApiResponse::failed { reason } => LatestCommittedTimeResult::failed(reason),
        }
    }

    fn succeed(time: LatestCommittedTimeResponseDto) -> Self {
        LatestCommittedTimeResult {
            latestCommittedTime: ApiResult::Succeed(SucceedResult {
                data: DateTime::parse_from_rfc3339(&time.latestCommittedTime).unwrap(),
            }),
        }
    }

    fn failed(reason: String) -> Self {
        LatestCommittedTimeResult {
            latestCommittedTime: ApiResult::Failed(FailedResult { reason }),
        }
    }

    pub fn latest_committed_time(&self) -> &ApiResult<Date> {
        &self.latestCommittedTime
    }
}

#[derive(Eq, PartialEq, Serialize, Deserialize, Debug, Clone)]
pub struct Template {
    name: String,
    content: String,
}

impl Template {
    // this is used in test only
    #[allow(dead_code)]
    pub const fn new(name: String, content: String) -> Self {
        Template { name, content }
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn content(&self) -> &String {
        &self.content
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TemplatesResult {
    templates: ApiResult<Templates>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TemplatesResponseDto {
    templates: Templates,
}

impl TemplatesResponseDto {
    pub fn templates(&self) -> Templates {
        self.templates.to_owned()
    }
}

impl TemplatesResult {
    pub fn from_response(response: ApiResponse<TemplatesResponseDto>) -> Self {
        match response {
            ApiResponse::succeed { data } => TemplatesResult::succeed(data),
            ApiResponse::failed { reason } => TemplatesResult::failed(reason),
        }
    }

    fn succeed(data: TemplatesResponseDto) -> Self {
        TemplatesResult {
            templates: ApiResult::Succeed(SucceedResult {
                data: data.templates,
            }),
        }
    }

    fn failed(reason: String) -> Self {
        TemplatesResult {
            templates: ApiResult::Failed(FailedResult { reason }),
        }
    }

    pub fn templates(&self) -> &ApiResult<Templates> {
        &self.templates
    }
}
