const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const authValidation = require("../validations/auth.validation");

router.post("/register", validate(authValidation.register), authController.register);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/refresh-tokens",validate(authValidation.refreshTokens),authController.refreshTokens);
router.post("/logout",validate(authValidation.logout), auth.user,authController.logout);
router.post("/send-verification-email", auth.user, authController.sendVerificationEmail);
router.post("/verify-email", validate(authValidation.verifyEmail), authController.verifyEmail);

module.exports = router;