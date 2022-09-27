const express = require("express");
const router = express.Router();

router.use("/user", require("./user.route"));
router.use("/auth", require("./auth.route"));
router.use("/generate", require("./generate.route"));
module.exports = router;