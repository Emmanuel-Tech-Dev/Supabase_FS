const { check, validationResult, body } = require("express-validator");

const userLoginValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .not()
    .isEmpty()
    .withMessage("Email is required"),

  // Custom password validation
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .custom((value) => {
      const hasLowercase = /[a-z]/.test(value);
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const errors = [];
      if (!hasLowercase)
        errors.push("Password must have at least 1 lowercase letter");
      if (!hasUppercase)
        errors.push("Password must have at least 1 uppercase letter");
      if (!hasNumber) errors.push("Password must have at least 1 number");
      if (!hasSymbol) errors.push("Password must have at least 1 symbol");

      if (errors.length) {
        throw new Error(errors.join(" /n "));
      }
      return true;
    }),
];

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = { userLoginValidator, validateLogin };
