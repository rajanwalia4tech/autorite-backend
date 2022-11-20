const express = require("express");
const router = express.Router();
const {SubscriptionController} = require("../controllers");
const auth = require("../middlewares/auth");

router.post("/webhook",SubscriptionController.webhook);
router.get("/plans",SubscriptionController.getAllPlans);

module.exports = router;