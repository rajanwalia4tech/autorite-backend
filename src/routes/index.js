const express = require("express");
const router = express.Router();

router.use("/user", require("./user.route"));
router.use("/auth", require("./auth.route"));
router.use("/generate", require("./generate.route"));
router.use("/article", require("./article.route"));
module.exports = router;