const utilities = require("../utilities/")
const garageModel = require("../models/garage-model")

/* ***************************
 * Build "My Garage" view
 * ************************** */
async function buildGarage(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData

    if (!accountData) {
      req.flash("notice", "Please log in to view your garage.")
      return res.redirect("/account/login")
    }

    const favorites = await garageModel.getFavoritesByAccountId(accountData.account_id)

    res.render("account/my-garage", {
      title: "My Garage",
      nav,
      errors: null,
      favorites,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Add a vehicle to "My Garage"
 * ************************** */
async function addToGarage(req, res, next) {
  try {
    const accountData = res.locals.accountData
    if (!accountData) {
      req.flash("notice", "Please log in to add vehicles to your garage.")
      return res.redirect("/account/login")
    }

    const inv_id = parseInt(req.body.inv_id)
    if (!Number.isInteger(inv_id)) {
      req.flash("notice", "Invalid vehicle.")
      return res.redirect("/account/")
    }

    await garageModel.addFavorite(accountData.account_id, inv_id)

    req.flash("notice", "Vehicle added to your garage.")
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Remove a vehicle from "My Garage"
 * ************************** */
async function removeFromGarage(req, res, next) {
  try {
    const accountData = res.locals.accountData
    if (!accountData) {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }

    const inv_id = parseInt(req.body.inv_id)
    if (!Number.isInteger(inv_id)) {
      req.flash("notice", "Invalid vehicle.")
      return res.redirect("/account/")
    }

    await garageModel.removeFavorite(accountData.account_id, inv_id)

    req.flash("notice", "Vehicle removed from your garage.")
    const redirectTo = req.body.redirectTo || "/garage/"
    return res.redirect(redirectTo)
  } catch (error) {
    next(error)
  }
}

module.exports = { buildGarage, addToGarage, removeFromGarage }