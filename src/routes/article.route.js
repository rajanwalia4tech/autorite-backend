const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article.controller");
const articleValidation = require("../validations/article.validation");
const validate = require("../middlewares/validate");

router.post("/create",articleController.create);
router.get("/all",articleController.getAllArticles);
router.get("/:articleId",validate(articleValidation.getArticleById) ,articleController.getArticleById);
module.exports = router;