const utilities = require("../utilities/")
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
      nav,
    errors: null,
  })
}

module.exports = { buildLogin }