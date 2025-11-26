const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

module.exports = { buildLogin }

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

module.exports = { buildLogin, buildRegister }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


/* ****************************************
 *  Process login request unit 5
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ***************************
 *  Build account management view
 *  UNIT 5 ASSIGNMENT 5 task 3
 * ************************** */
async function buildAccountManagement (req, res, next) {
  try {
    const nav = await utilities.getNav()

    res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 *  Build account update view
 * unit 5, assignment 5, task 4
 * ************************** */
async function buildUpdateAccountView (req, res, next) {
  try {
    const account_id = parseInt(req.params.account_id)
    const nav = await utilities.getNav()

    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process account info update
 * unit 5, assignment 5, task 4
 * ************************** */
async function updateAccount (req, res, next) {
  try {
    const {
      account_id,
      account_firstname,
      account_lastname,
      account_email
    } = req.body

    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (updateResult.rowCount > 0) {
      req.flash("notice", "Account information updated successfully.")

      const updatedAccount = await accountModel.getAccountById(account_id)

      const nav = await utilities.getNav()
      return res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Account update failed.")
      return res.redirect(`/account/update/${account_id}`)
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process password change
 * unit 5, assignment 5, task 4
 * ************************** */
async function updatePassword (req, res, next) {
  try {
    const account_id = parseInt(req.body.account_id)
    const plainPassword = req.body.account_password

    let hashedPassword = await bcrypt.hash(plainPassword, 10)

    const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
    )

    if (updateResult.rowCount > 0) {
      req.flash("notice", "Password updated successfully.")
    } else {
      req.flash("notice", "Password update failed.")
    }

    const nav = await utilities.getNav()
    return res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process logout request
 * ************************** */
async function logout(req, res, next) {
  try {
    res.clearCookie("jwt")

    req.flash("notice", "You have successfully logged out.")

    return res.redirect("/")
  } catch (error) {
    next(error)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccountView, updateAccount, updatePassword, logout }