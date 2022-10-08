const express = require("express");
const router = express.Router();
const commonController = require("../controllers/common.controller");

router.get("/locations",commonController.getLocations);


module.exports = router;