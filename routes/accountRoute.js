const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


/* deliver login view */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* deliver registration view */
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post("/register", regValidate.registrationRules(),
  regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login unit 4
// modified login process activity unit 5
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin))

// deliver account management view unit 5
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Deliver account update view
router.get("/update/:account_id", utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccountView))

// Process account info update (name + email)
router.post("/update", utilities.checkLogin, regValidate.updateAccountRules(),
  regValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))

// Process password change
router.post("/update-password", utilities.checkLogin, regValidate.updatePasswordRules(),
  regValidate.checkPasswordData,utilities.handleErrors(accountController.updatePassword))


module.exports = router
