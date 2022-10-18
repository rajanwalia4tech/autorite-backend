const express = require("express");
const router = express.Router();
const commonController = require("../controllers/common.controller");
const auth = require("../middlewares/auth");
router.get("/locations",auth.user,commonController.getLocations);


module.exports = router;