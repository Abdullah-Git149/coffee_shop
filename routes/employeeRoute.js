const express = require('express');
const router = express.Router()
const { checkVendorAuth } = require("../auth/checkVendorAuth")
const { checkEmployeeAuth } = require("../auth/checkEmployeeAuth")
const { addEmployee, employeeList, employeeEdit, employeeLogin, employeeEditProfile,employeeForgetPassword, employeeUpdatePassword, employeeVerifyUser, employeelogOut, employeeResetPassword } = require("../controller/employeeController.js")
const { upload } = require("../utils/utils")


router.post("/api/employee/add-employee", checkVendorAuth, upload.single("employee_image"), addEmployee)
router.get("/api/employee/list-of-employee", checkVendorAuth, employeeList)
router.post("/api/employee/update-employee/:empId", checkVendorAuth, upload.single("employee_image"), employeeEdit)


// EMPLOYEE WORKING
router.post("/api/employee/employee-login", employeeLogin)
router.post("/api/employee/forget-password", employeeForgetPassword)
router.post("/api/employee/verify-user", employeeVerifyUser)
router.post("/api/employee/reset-password", employeeResetPassword)
router.post("/api/employee/update-password",checkEmployeeAuth, employeeUpdatePassword)
router.post("/api/employee/log-out", checkEmployeeAuth, employeelogOut)
router.post("/api/employee/profile-update", checkEmployeeAuth,upload.single("employee_image") , employeeEditProfile)


module.exports = router