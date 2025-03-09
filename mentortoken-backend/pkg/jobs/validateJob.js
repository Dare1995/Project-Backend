const { Validator } = require("node-input-validator");

const NewJobValidate = {
    title: "required|string",
    description: "required|string",
    category: "required|string",
    skillsRequired: "array",
    "skills.*": "string",
    status: "required|string",
};

const validateJob = async (data, schema) => {
    const validator = new Validator(data, schema);
    const err = await validator.check();

    if (!err) {
        const errorMessages = Object.entries(validator.errors).map(([key, value]) => ({
            field: key,
            message: value.message,
        }));
        throw {
            code: 400,
            message: "Validation failed",
            errors: errorMessages,
        };
    }
};


module.exports = {
    NewJobValidate,
    validateJob,
};