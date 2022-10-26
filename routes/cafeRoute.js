const express = require('express');
const router = express.Router()
const { checkVendorAuth } = require("../auth/checkVendorAuth")
const { addCafe, getAllCafe, editCafe, addProduct, editProduct, deleteProduct, deleteAddOn } = require("../controller/cafeController")
const { upload } = require("../utils/utils")


router.post("/api/cafe/add-cafe", checkVendorAuth, upload.single("cafe_image"), addCafe)
router.get("/api/cafe/get-all-cafe", checkVendorAuth, getAllCafe)
router.post("/api/cafe/edit-cafe/:cafeId", upload.single("cafe_image"), editCafe)
router.post("/api/cafe/add-product", checkVendorAuth, upload.single("product_image"), addProduct)
router.post("/api/cafe/edit-product/:id", checkVendorAuth, upload.single("product_image"), editProduct)
router.delete("/api/cafe/delete-product/:id/:addOnId", checkVendorAuth, deleteProduct)
router.delete("/api/cafe/addOn-delete/:id/:addOnId", checkVendorAuth, deleteAddOn)


module.exports = router