const express = require("express");
const router = express.Router();

router.use("/user", require("./user.route"));
router.use("/auth", require("./auth.route"));
router.use("/generate", require("./generate.route"));
router.use("/article", require("./article.route"));
router.use("/wordpress",require("./wordpress.route"));
router.use("/subscription",require("./subscription.route"));
router.use("/",require("./common.route"));
module.exports = router;