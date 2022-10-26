const express = require('express');
const router = express.Router()
const { signUp, signIn, verifyUser, forgetPassword, resetPassword, updatePassword, completeProfile } = require("../controller/userController")
const { checkVendorAuth } = require("../auth/checkVendorAuth")
// VENDOR API'S
router.post("/api/vendor/sign-up", signUp)
router.post("/api/vendor/sign-in", signIn)
router.post("/api/vendor/verify-user", verifyUser)
router.post("/api/vendor/forget-password", forgetPassword)
router.post("/api/vendor/reset-password", resetPassword)
router.post("/api/vendor/complete-profile", completeProfile)
router.post("/api/vendor/update-password", checkVendorAuth, updatePassword)

module.exports = router