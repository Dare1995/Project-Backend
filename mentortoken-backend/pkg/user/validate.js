const { Validator } = require("node-input-validator");

const AccoutLogin = {
  email: "required|string",
  password: "required|string",
};

const AccoutRegister = {
  name: "required|string",
  email: "required|email",
  password: "required|string",
  confirmPassword: "required|string",
  type: "required|string",
  phone: "required|string",
  image: "required|string",
  role: "string",
  skills: "array",
  "skills.*": "string",
  desc: "string",
  acceptedJobs: "array",
  "acceptedJobs.*": "string",
  representative: "string",
  address: "string",
  jobsPosted: "array",
  "jobsPosted.*": "string"
};

const AccountUpdate = {
  name: "string",
  email: "email",
  password: "string",
  confirmPassword: "string",
  type: "string",
  phone: "string",
  image: "string",
  role: "string",
  skills: "array",
  "skills.*": "string",
  desc: "string",
  acceptedJobs: "array",
  "acceptedJobs.*": "string",
  representative: "string",
  address: "string",
  jobsPosted: "array",
  "jobsPosted.*": "string"
};

const AccountPassword = {
  newPassword: "required|string",
  confirmNewPassword: "required|string"
};

const AccountContactMessage = {
  fullName: "required|string",
  email: "required|string",
  message: "required|string"
};

const validateAccount = async (data, schema) => {
  const validator = new Validator(data, schema);
  const err = await validator.check();

  if (!err) {
    throw {
      code: 400,
      message: "Validation failed",
      errors: validator.errors,
    };
  }
};


module.exports = {
  AccoutLogin,
  AccoutRegister,
  AccountUpdate,
  AccountPassword,
  AccountContactMessage,
  validateAccount,
};