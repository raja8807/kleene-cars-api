const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.get("/profile", AuthController.getProfile);
router.post("/otp/send", AuthController.sendOtp);

module.exports = router;
