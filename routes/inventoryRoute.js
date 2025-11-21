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

// build management view route
router.get("/", utilities.handleErrors(invController.buildManagementView));

//build add classification view route
router.get("/newclassification", utilities.handleErrors(invController.buildAddClassificationView));

//process add classification
router.post("/addClassification", invChecks.classificationRule(),
    invChecks.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

// build add vehicle view route
router.get("/newvehicle", utilities.handleErrors(invController.buildAddVehicleView));

// process add vehicle rouute
router.post("/addInventory", invChecks.newInventoryRules(),
    invChecks.checkInventoryData,
    utilities.handleErrors(invController.addInventory));

  
module.exports = router;