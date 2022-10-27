const express = require('express');
const router = express.Router()
const { socialLogin, logOut, editUser } = require("../controller/userController")
const { checkVendorAuth } = require("../auth/checkVendorAuth")
const { checkUserAuth } = require("../auth/checkUserAuth")
const { upload } = require("../utils/utils")

// VENDOR API'S

router.post("/api/user/social-login", socialLogin)
router.post("/api/user/update-user", checkUserAuth, upload.single("user_image"), editUser)
router.get("/api/user/log-out", checkUserAuth, logOut)

module.exports = router