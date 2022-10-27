const Cafe = require("../models/Cafe")
const User = require("../models/User")
const moment = require("moment")
const Product = require("../models/Product")
const addCafe = async (req, res) => {
    try {

        if (!req.body.cafe_name) {
            return res.status(400).json({ status: 0, message: "Cafe name is required" })
        } else if (!req.body.cafe_detail) {
            return res.status(400).json({ status: 0, message: "Cafe Detail is required" })
        } else if (!req.body.cafe_starttime) {
            return res.status(400).json({ status: 0, message: "Start Time is required" })
        } else if (!req.body.cafe_endtime) {
            return res.status(400).json({ status: 0, message: "End Time is required" })
        } else if (req.body.cafe_starttime === req.body.cafe_endtime) {
            return res.status(400).json({ status: 0, message: "Time can not be same" })
        } else if (!req.file) {
            return res.status(400).json({ status: 0, message: "Please Select Image" })
        } else if (!req.file) {
            return res.status(400).json({ status: 0, message: "Cafe Address is required" })
        } else {

            // const vendor = await User.findById({ _id: req.payload._id })
            // if (!vendor.subscribtion){

            // }

            const cafe = new Cafe({
                cafe_name: req.body.cafe_name,
                cafe_detail: req.body.cafe_detail,
                cafe_address: req.body.cafe_address,
                cafe_starttime: moment(req.body.cafe_starttime, "hh:mm A").format("hh:mm A"),
                cafe_endtime: moment(req.body.cafe_endtime, "hh:mm A").format("hh:mm A"),
                cafe_image: req.file ? req.file.path : req.body.cafe_image,
                vendor_id: req.payload._id

            })
            const newCafe = await cafe.save()
            if (newCafe) {
                return res.status(200).json({ status: 1, message: "Cafe Created", newCafe })
            } else {
                return res.status(400).json({ status: 0, message: "Something Went Wrong" })
            }
        }

    } catch (error) {

        res.status(500).json({ error: error.message })
    }
}



const editCafe = async (req, res) => {
    try {

        const _id = req.params.cafeId
        const cafe = await Cafe.findByIdAndUpdate(
            { _id },
            {
                cafe_name: req.body.cafe_name,
                cafe_detail: req.body.cafe_detail,
                cafe_address: req.body.cafe_address,
                cafe_starttime: moment(req.body.cafe_starttime, "hh:mm A").format("hh:mm A"),
                cafe_endtime: moment(req.body.cafe_endtime, "hh:mm A").format("hh:mm A"),
                cafe_image: req.file ? req.file.path : req.body.cafe_image,
            },
            {
                new: true
            }
        )
        if (cafe) {
            return res.status(200).json({ status: 1, message: "Cafe Edited", cafe })
        } else {

            return res.status(400).json({ status: 0, message: "Something Went Wrong" })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



const getAllCafe = async (req, res) => {
    try {
        const cafe = await Cafe.find({ vendor_id: req.payload._id })
        if (cafe.length < 1) {
            return res.status(400).json({ status: 0, message: "No Cafe Found" })
        } else {
            return res.status(200).json({ status: 1, message: "List of Cafe", cafe })
        }

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}



const addProduct = async (req, res) => {
    try {
        if (!req.body.product_name) {
            return res.status(400).json({ status: 0, message: "Product name is required" })
        } else if (!req.body.product_specicality) {
            return res.status(400).json({ status: 0, message: "Product Speciality is required" })
        } else if (!req.body.product_price) {
            return res.status(400).json({ status: 0, message: "Product Price is required" })
        } else if (!req.body.time_to_deliver) {
            return res.status(400).json({ status: 0, message: "Time to deliver is required" })
        } else if (!req.file) {
            return res.status(400).json({ status: 0, message: "Image is required" })
        } else {
            const product = new Product({
                product_name: req.body.product_name,
                product_price: req.body.product_price,
                product_specicality: req.body.product_specicality,
                product_image: req.file ? req.file.path : req.body.product_image,
                time_to_deliver: req.body.time_to_deliver,
                addOns: JSON.parse(req.body.addOns),
                vendor_id: req.payload._id,
                category: req.body.category,
                cafe_id: req.body.cafeId
            })

            await product.save()
            if (product) {
                return res.status(200).json({ status: 0, message: "Product Created", product })
            }

        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const editProduct = async (req, res) => {
    try {

        const id = req.params.id
        const Exproduct = await Product.findOne({ _id: id })
        console.log(typeof (req.body.addOns))
        const product = await Product.findByIdAndUpdate({ _id: id },
            {
                product_name: req.body.product_name ? req.body.product_name : Exproduct.product_name,
                product_image: req.file ? req.file.path : Exproduct.product_image,
                product_specicality: req.body.product_specicality ? req.body.product_specicality : Exproduct.product_specicality,
                product_price: req.body.product_price ? req.body.product_price : Exproduct.product_price,
                time_to_deliver: req.body.time_to_deliver ? req.body.time_to_deliver : Exproduct.time_to_deliver,
                $addToSet: { addOns: { $each: req.body.addOns ? JSON.parse(req.body.addOns) : Exproduct.addOns } }
            },
            {
                new: true
            })
        if (product) {
            return res.status(200).json({ status: 1, message: "Product Edited", product })
        } else {
            return res.status(400).json({ status: 0, message: "Cannot Edit" })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const product = await Product.findByIdAndDelete({ _id })
        if (product) {
            return res.status(200).json({ status: 1, message: "Product Deleted" })
        } else {
            return res.status(400).json({ status: 0, message: "Product not Found" })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


const deleteAddOn = async (req, res) => {
    try {
        const _id = req.params.id
        const addOnId = req.params.addOnId

        const product = await Product.findByIdAndUpdate({ _id }, { $pull: { addOns: { id: addOnId } } }, { new: true })
        // const product = await Product.findByIdAndUpdate({ _id }, { $pull: { addOns: { $elemMatch: { id: addOnId } } } }, { new: true })
        // const product = await Product.findByIdAndUpdate({ _id }, { $pull: { addOn: { $in: addOnId } } }, { new: true })
        if (product) {
            return res.status(200).json({ status: 1, message: "AddOn Delete" })
        } else {
            return res.status(400).json({ status: 0, message: "Product not Found" })
        }

    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}


module.exports = { addCafe, getAllCafe, editCafe, addProduct, editProduct, deleteProduct, deleteAddOn }