const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

//GET ALL SERVICES
router.get("/", serviceController.getServices); 
// POST SERVICE
router.post("/", serviceController.createService);
// DELETE SERVICE
router.delete("/:id", serviceController.deleteService);
// UPDATE SERVICE
router.put("/:id", serviceController.updateService);    

module.exports = router;