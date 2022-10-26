const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const cafeSchema = mongoose.Schema({
    cafe_name: {
        type: String,
        trim: true,
        default: null
    },
    cafe_detail: {
        type: String,
        trim: true,
        default: null
    },
    cafe_starttime: {
        type: String,
        trim: true,
    },
    cafe_endtime: {
        type: String,
        trim: true,
    },
    cafe_image: {
        type: String,
        default: null
    },
    cafe_address: {
        type: String,
        default: null
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    is_blocked: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    })



const Cafe = mongoose.model("Cafe", cafeSchema)

module.exports = Cafe