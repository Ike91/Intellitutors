// validation.js

const { validate } = require("validate.js");

const validateRegistration = (formData) => {
  const constraints = {
    name: {
      presence: { allowEmpty: false },
    },
    email: {
      presence: { allowEmpty: false },
      email: true,
    },
    phoneNumber: {
      presence: { allowEmpty: false },
      numericality: { onlyInteger: true },
    },
    studentType: {
      presence: { allowEmpty: false },
    },
    password: {
      presence: { allowEmpty: false },
      length: { minimum: 6 },
      //    format: {
      //   pattern: /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d)(?=.*[A-Z])/,
      //   message: 'Password should contain at least one special character, one number, and one uppercase letter',
      // },
    },
    confirmPassword: {
      presence: { allowEmpty: false },
      equality: "password",
    },
  };

  const validationErrors = validate(formData, constraints);
  return validationErrors;
};

//validate uplaod assignment
const validateAssignment = (formData) => {
  const dateValidatorOptions = {
    parse: { dateInput: "YYYY-MM-DD" },
    format: { dateOutput: "YYYY-MM-DD" },
  };

  const constraints = {
    module: {
      presence: {
        allowEmpty: false,
        message: "Module/Subject is required",
      },
    },
  
    instructions: {
      presence: {
        allowEmpty: false,
        message: "Instructions are required",
      },
    },
    dueDate: {
      presence: {
        allowEmpty: false,
        message: "Expected Deadline is required",
      },
    },
  };

  const validationErrors = validate(formData, constraints);
  return validationErrors;
};

//loginValidation
const LoginValidation = (formData) => {
  const constraints = {
    email: {
      presence: { allowEmpty: false },
      email: true,
    },

    password: {
      presence: { allowEmpty: false },
      length: { minimum: 6 },
    },
  };

  const validationErrors = validate(formData, constraints);
  return validationErrors;
};

// book a tutor validation
const BookValidation = (formData) => {
  const constraints = {
    module: {
      presence: { allowEmpty: false },
    },
    module: {
      presence: { allowEmpty: false },
    },
    bookingType: {
      presence: { allowEmpty: false },
    },
    date: {
      presence: { allowEmpty: false },
    },
    venue: {
      presence: { allowEmpty: false },
      length: { minimum: 6 },
    },
    hours: {
      presence: { allowEmpty: false },
      numericality: { onlyInteger: true },
    },
  };

  const validationErrors = validate(formData, constraints);
  return validationErrors;
};

module.exports = {
  validateRegistration,
  BookValidation,
  validateAssignment,
  LoginValidation,
};
