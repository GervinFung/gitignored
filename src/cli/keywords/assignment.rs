use crate::types::Str;

#[derive(Debug, Clone)]
pub struct AssignmentOption {
    declaration: Str,
}

impl AssignmentOption {
    pub fn new() -> Self {
        AssignmentOption { declaration: "--" }
    }

    pub fn declaration(&self) -> Str {
        self.declaration
    }
}

#[derive(Debug, Clone)]
pub struct AssignmentAssign {
    equal: Str,
    space: Str,
}

impl AssignmentAssign {
    pub fn new() -> Self {
        AssignmentAssign {
            equal: "=",
            space: " ",
        }
    }

    pub fn equal(&self) -> Str {
        self.equal
    }

    pub fn space(&self) -> Str {
        self.space
    }
}

#[derive(Debug, Clone)]
pub struct Assignment {
    option: AssignmentOption,
    assign: AssignmentAssign,
}

impl Assignment {
    pub fn new() -> Self {
        Assignment {
            option: AssignmentOption::new(),
            assign: AssignmentAssign::new(),
        }
    }

    pub fn option(&self) -> &AssignmentOption {
        &self.option
    }

    pub fn assign(&self) -> &AssignmentAssign {
        &self.assign
    }
}
