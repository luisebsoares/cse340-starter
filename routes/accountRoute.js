const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

/* deliver login view */
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* deliver registration view */
router.get("/register", utilities.handleErrors(accountController.buildRegister));

/* process registration */
router.post("/register", utilities.handleErrors(accountController.registerAccount))



module.exports = router