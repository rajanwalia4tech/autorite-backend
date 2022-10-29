const express = require("express");
const router = express.Router();
const articleController = require("../controllers/article.controller");
const articleValidation = require("../validations/article.validation");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

router.post("/create",validate(articleValidation.create), auth.user,articleController.create);
router.get("/all",auth.user, articleController.getAllArticles);
router.get("/:articleId",validate(articleValidation.getArticleById), auth.user,articleController.getArticleById);
router.get("/status/:articleId", auth.user,articleController.getArticleStatus);
router.patch("/save", auth.user,articleController.saveArticle);
module.exports = router;