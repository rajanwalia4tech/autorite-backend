const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article.controller");

router.post("/create",articleController.create);

module.exports = router;