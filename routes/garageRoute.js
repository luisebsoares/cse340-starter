const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const garageController = require("../controllers/garageController")

// Show "My Garage"
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(garageController.buildGarage)
)

// Add vehicle to My Garage
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(garageController.addToGarage)
)

// Remove vehicle from My Garage
router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(garageController.removeFromGarage)
)

module.exports = router
