const express = require("express");
const router = express.Router();
const generateController = require("../controllers/generate.controller");
const auth = require("../middlewares/auth");

router.get("/usecases",auth.user,generateController.getAllUsecases);

router.post("/",auth.user,generateController.generate);

module.exports = router;