const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article.controller");
const articleValidation = require("../validations/article.validation");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

router.post("/create",validate(articleValidation.create), auth.user,articleController.create);
router.get("/all",auth.user, articleController.getAllArticles);
router.get("/:articleId",validate(articleValidation.getArticleById), auth.user,articleController.getArticleById);
module.exports = router;