const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        trim: true,
        default: null
    },
    password: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        default: null
    },
    number: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    age: {
        type: String,
        default: null,
        required: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: false,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: false
        }
    },
    role: {
        type: String,
        enum: ["vendor", "user", "employee"],
        required: false,
        default: "user"
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        require: false,
        ref: "User"
    },
    cafe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cafe"
    },
   employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subscribtion: {
        type: Boolean,
        require: false,
        default: false
    },
    authentication: {
        type: String,
        default: null,
        required: false
    },
    code: {
        type: Number,
        default: null
    },
    verified: {
        type: Number,
        default: 0
    },
    is_blocked: {
        type: Number,
        default: 0
    },
},
    {
        timestamps: true
    })


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ userId: user._id }, process.env.KEY)
    user.user_authentication = token;
    await user.save();
    return token;
}

const User = mongoose.model("User", userSchema)

module.exports = User