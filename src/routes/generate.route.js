const express = require("express");
const router = express.Router();
const generateController = require("../controllers/generate.controller");

router.get("/usecases",generateController.getAllUsecases);

router.post("/",generateController.generate);

module.exports = router;