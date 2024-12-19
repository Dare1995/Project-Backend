const { Validator } = require("node-input-validator");

const NewJobValidate = {
    title: "required|string",
    description: "required|string",
    category: "required|string",
    skillsRequired: "array",
    "skills.*": "string",
    status: "required|string",
};

const JobUpdate = {
    title: "string",
    description: "string",
    category: "string",
    skillsRequired: "array",
    "skills.*": "string",
    status: "string"
};

const validateJob = async (data, schema) => {
    const validator = new Validator(data, schema);
    const err = await validator.check();

    if(!err) {
        throw {
            code: 400,
            message: "Validation failed",
            errors: validator.errors,
        };
    };
};

module.exports = {
    NewJobValidate,
    JobUpdate,
    validateJob,
};