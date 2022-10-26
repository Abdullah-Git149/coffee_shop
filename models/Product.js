const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const productSchema = mongoose.Schema({
    product_name: {
        type: String,
        trim: true,
        default: null
    },
    product_specicality: {
        type: String,
        trim: true,
        default: null
    },
    product_price: {
        type: String,
        trim: true,
    },
    time_to_deliver: {
        type: String,
        trim: true,
    },
    product_image: {
        type: String,
        default: null
    },
    addOns: {
        type:Array,
        default:[]
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cafe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cafe"
    },

},
    {
        timestamps: true
    })



const Product = mongoose.model("Product", productSchema)

module.exports = Product