const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");
router.get("/",auth.user,userController.getUserInfo);

module.exports = router;