const express = require("express");
const router = express.Router();
const {SubscriptionController} = require("../controllers");
const auth = require("../middlewares/auth");

router.post("/webhook",SubscriptionController.webhook);
router.get("/plans",auth.user,SubscriptionController.getAllPlans);
router.post("/create-session",auth.user,SubscriptionController.createSubscription);

module.exports = router;