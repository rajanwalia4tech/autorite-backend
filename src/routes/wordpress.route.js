const express = require("express");
const router = express.Router();
const wordpressValidation = require("../validations/wordpress.validation");
const validate = require("../middlewares/validate");
const wordpressController = require("../controllers/wordpress.controller");
const auth = require("../middlewares/auth");

router.post("/connect",validate(wordpressValidation.connect),auth.user, wordpressController.connect);

router.get("/details", auth.user,wordpressController.getWordpressInfo);

module.exports = router;