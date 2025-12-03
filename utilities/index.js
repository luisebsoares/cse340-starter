const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"

  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.rows.forEach((row) => {
    list += "<li>"

    list +=
      
      '<a href="/inv/type/' +

    row.classification_id +
      
    '" title="See our inventory of ' +
      
    row.classification_name +
      
    ' vehicles">' +
      
    row.classification_name +
      
      "</a>"
    
    list += "</li>"
  })

  list += "</ul>"

  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid

  if(data.length > 0){
    grid = '<ul id="inv-display">'

    data.forEach(vehicle => { 

      grid += '<li>'

      grid += '<a href="../../inv/detail/' + vehicle.inv_id 
        
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        
        + 'details"><img src="' + vehicle.inv_thumbnail 
        
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
        
        + ' on CSE Motors" /></a>'
      
      grid += '<div class="namePrice">'

      grid += '<hr />'

      grid += '<h2>'

      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View ' 
        
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      
      grid += '</h2>'

      grid += '<span>$' 
        
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      
      grid += '</div>'

      grid += '</li>'

    })

    grid += '</ul>'

  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  
  return grid
}

Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications()

  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"

  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`

    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected"
    }

    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"

  return classificationList
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildSingleVehicleDisplay = async (vehicle, isFavorite = false) => {
  let svd = '<section id="vehicle-display">'
  svd += "<div>"
  svd += '<section class="imagePrice">'
  svd +=
    "<img src='" +
    vehicle.inv_image +
    "' alt='Image of " +
    vehicle.inv_make +
    " " +
    vehicle.inv_model +
    " on CSE Motors' id='mainImage'>"
  svd += "</section>"
  svd += '<section class="vehicleDetail">'
  svd += "<h3> " + vehicle.inv_make + " " + vehicle.inv_model + " Details</h3>"
  svd += '<ul id="vehicle-details">'
  svd +=
    "<li><h4>Price: $" +
    new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
    "</h4></li>"
  svd += "<li><strong>Year:</strong> " + vehicle.inv_year + "</li>"
  svd += "<li><strong>Make:</strong> " + vehicle.inv_make + "</li>"
  svd += "<li><strong>Model:</strong> " + vehicle.inv_model + "</li>"
  svd += "<li><strong>Color:</strong> " + vehicle.inv_color + "</li>"
  svd += "<li><strong>Miles:</strong> " +
    new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
    "</li>"
  svd += "<li><strong>Description:</strong> " + vehicle.inv_description + "</li>"
  svd += "</ul>"

  // My Garage actions
  svd += '<div class="garage-actions">'
  if (isFavorite) {
    svd += `
      <form action="/garage/remove" method="post" class="garage-form">
        <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
        <input type="hidden" name="redirectTo" value="/inv/detail/${vehicle.inv_id}">
        <button type="submit">Remove from My Garage</button>
      </form>
    `
  } else {
    svd += `
      <form action="/garage/add" method="post" class="garage-form">
        <input type="hidden" name="inv_id" value="${vehicle.inv_id}">
        <button type="submit">Add to My Garage</button>
      </form>
    `
  }
  svd += "</div>"

  svd += "</section>"
  svd += "</div>"
  svd += "</section>"
  return svd
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity unit 5
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login unit 5
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


 /* ****************************************
 *  Check account type is Employee or Admin
 *   unit 5 assigment 5 task 2
 * ************************************ */
Util.checkEmployeeOrAdmin = (req, res, next) => {
  const accountData = res.locals.accountData

  if (
    accountData &&
    (accountData.account_type === "Employee" ||
      accountData.account_type === "Admin")
  ) {
    return next()
  }

  req.flash("notice", "You do not have permission to access that page.")
  return res.redirect("/account/")
}


module.exports = Util