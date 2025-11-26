// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invChecks = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle detail view
router.get("/detail/:invId", invController.buildVehicleDetail);

// Error route for testing error handling
router.get("/broken", utilities.handleErrors(invController.throwError));

// build management view route (Employee/Admin only)
router.get("/", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.buildManagementView))

// build add classification view route
router.get("/newClassification", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
    utilities.handleErrors(invController.buildAddClassificationView))

// process add classification
router.post("/addClassification", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
    invChecks.classificationRule(), invChecks.checkClassificationData,
    utilities.handleErrors(invController.addClassification))

// get inventory for AJAX (used by management page)
router.get("/getInventory/:classification_id", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.getInventoryJSON))

// build add vehicle view route
router.get("/newVehicle", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddVehicleView))

// process add vehicle route
router.post("/addInventory", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
  invChecks.newInventoryRules(), invChecks.checkInventoryData, utilities.handleErrors(invController.addInventory))

// build edit inventory view route
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView))

// process inventory update route
router.post("/editInventory", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
  invChecks.newInventoryRules(), invChecks.checkInventoryData, utilities.handleErrors(invController.updateInventory))

// delete confirmation view route
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryView))

// process inventory delete route
router.post("/deleteInventory", utilities.checkLogin, utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory))


module.exports = router;