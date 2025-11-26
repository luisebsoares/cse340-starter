const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}
  
/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
  return [
    // name is required and must be string
    body("account_firstname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // name is required and must be string
    body("account_lastname")
      .trim()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.
  
        // valid email is required and cannot already exist in the database
      body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exists. Please log in or use different email")
            }
        }),
  
      // password is required and must be strong password
        body("account_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}


/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check login data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* ***************************
 *  Rules for updating account info
 *  unit 5, assignment 5, task 4
 * ************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = parseInt(req.body.account_id)
        const existingAccount = await accountModel.getAccountByEmail(
          account_email
        )
        if (existingAccount && existingAccount.account_id !== account_id) {
          throw new Error("That email is already in use.")
        }
      })
  ]
}

/* ***************************
 *  Check update account data
 *  unit 5, assignment 5, task 4
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors,
      account_id: req.body.account_id,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    })
  }
  next()
}

/* ***************************
 *  Rules for updating password
 *  unit 5, assignment 5, task 4
 * ************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain a number.")
  ]
}

/* ***************************
 *  Check password update data
 *  unit 5, assignment 5, task 4
 * ************************** */
validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors,
      account_id: req.body.account_id
    })
  }
  next()
}


module.exports = validate