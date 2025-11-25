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
router.get("/newClassification", utilities.handleErrors(invController.buildAddClassificationView));

//process add classification
router.post("/addClassification", invChecks.classificationRule(),
    invChecks.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

//get inventory for AJAX route
//unit 5 select inv item activity
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


// build add vehicle view route
router.get("/newVehicle", utilities.handleErrors(invController.buildAddVehicleView));

// process add vehicle route
router.post("/addInventory", invChecks.newInventoryRules(),
    invChecks.checkInventoryData,
    utilities.handleErrors(invController.addInventory));

    // build edit inventory view route (Unit 5)
    router.get(
      "/edit/:inv_id",
      utilities.handleErrors(invController.editInventoryView)
    )
    
    // process inventory update route
    router.post(
      "/editInventory",
      invChecks.newInventoryRules(), invChecks.checkInventoryData, utilities.handleErrors(invController.updateInventory)
    )
  
module.exports = router;