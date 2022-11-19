const express = require("express");
const router = express.Router();
const {SubscriptionController} = require("../controllers");
const auth = require("../middlewares/auth");

router.post("/webhook",SubscriptionController.webhook);

module.exports = router;