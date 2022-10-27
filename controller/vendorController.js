const User = require("../models/User")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/utils")

//  SIGN UP
const signUp = async (req, res) => {
    try {

        const emailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const pass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/


        if (!req.body.name) {
            return res.status(400).json({ status: 0, message: " name is required" })
        } else if (!req.body.email) {
            return res.status(400).json({ status: 0, message: "Email is required" })
        } else if (!req.body.email.match(emailValidation)) {
            return res.status(400).json({ status: 0, message: "Invalid email address" })
        } else if (!req.body.password) {
            return res.status(400).json({ status: 0, message: "Password is required" })
        } else if (!req.body.password.match(pass)) {
            return res.status(400).json({ status: 0, message: "Password should be 8 characters long (should contain uppercase, lowercase, numeric and special character)" })
        } else if (!req.body.confirm_password) {
            return res.status(400).json({ status: 0, message: "Confirm Password is required" })
        } else if (req.body.password !== req.body.confirm_password) {
            return res.status(400).json({ status: 0, message: "Password not match" })
        }
        else {
            const check = await User.findOne({ email: req.body.email })
            if (check) {
                return res.status(400).json({ status: 0, message: "This email is occupied by another " })
            } else {

                const salt = 10
                const hashPassword = await bcrypt.hash(req.body.password, salt)
                const verificationCode = Math.floor(100000 + Math.random() * 900000)

                const user = new User({
                    email: req.body.email,
                    name: req.body.name,
                    password: hashPassword,
                    code: verificationCode,
                    verified: 0,
                    role: "vendor"
                })

                await user.save().then(async (result) => {
                    sendEmail(user, verificationCode)

                    return res.status(200).json({ status: 1, message: "Account has been created", data: result })
                }).catch((err) => {
                    res.status(400).json({ status: 0, message: "Something went wrong", error: err.message })
                })
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).send(error.message);

    }
}

// FORGET PASSWORD
const forgetPassword = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ status: 0, message: "Email is required" });
        } else {
            const user = await User.findOne({ email: req.body.email, role: "vendor" })
            if (!user) {
                return res.status(400).json({ status: 0, message: "User not found" });
            } else {
                const verficationCode = Math.floor(100000 + Math.random() * 900000)
                const newUser = await User.findByIdAndUpdate({ _id: user._id, role: "vendor" }, { code: verficationCode })
                if (newUser) {
                    sendEmail(user, verficationCode)
                    return res.status(200).json({ status: 1, message: "Code successfully send to email : " + verficationCode, userId: newUser._id })
                } else {
                    return res.status(200).json({ status: 0, message: "Something went wrong" })
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {

        if (!req.body._id) {
            return res.status(400).json({ status: 0, message: "User id is required" })
        } else if (!req.body.password) {
            return res.status(400).json({ status: 0, message: "Please enter a password" })
        } else {
            const user = await User.findById({ _id: req.body._id, role: "vendor" })
            if (!user) {
                return res.status(400).json({ status: 0, message: "User not found" })
            } else {
                const hashPassword = await bcrypt.hash(req.body.password, 10)

                const hashedUser = await User.findByIdAndUpdate({ _id: user._id, role: "vendor" }, { password: hashPassword })
                if (hashPassword) {
                    return res.status(200).json({ status: 1, message: "Password changed Succussfully" })
                } else {

                    return res.status(400).json({ status: 0, message: "Something went wrong" })
                }
            }
        }
    } catch (error) {

        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}  

// UPDATE PASSWORD
const updatePassword = async (req, res) => {
    try {



        if (!req.body.password) {
            return res.status(400).json({ status: 0, message: "Please enter old password" })
        } else if (!req.body.user_new_password) {
            return res.status(400).json({ status: 0, message: "Please enter new password" })
        }
        const user = await User.findById(req.payload._id)


        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(400).json({ status: 0, message: "Please enter correct old password" })
        } else {
            const hashPassword = await bcrypt.hash(req.body.user_new_password, 10)
            const newUser = await User.findByIdAndUpdate({ _id: req.payload._id, role: "vendor" }, { password: hashPassword })
            await newUser.save()

            return res.status(200).json({ status: 1, message: "Password changed successfully" })

        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}

// // VERIFY USER
const verifyUser = async (req, res) => {
    try {
        if (!req.body._id) {
            return res.status(400).json({ status: 0, message: " Id is required" })
        } else if (!req.body.verficationCode) {
            return res.status(400).json({ status: 0, message: "verficationCode is required" })
        }
        await User.findOne({ _id: req.body._id, role: "vendor" }).then((result) => {
            if (req.body.verficationCode == result.code) {
                User.findByIdAndUpdate({ _id: req.body._id, role: "vendor" }, { verified: 1, code: null }, (error, result) => {
                    if (error) {
                        console.log(error.message);
                        return res.status(400).json({ status: 0, message: "Something Went Wrong", error })
                    }
                    if (result) {
                        return res.status(200).json({ status: 1, message: "OTP matched successfully" })
                    }
                })
            } else {
                return res.status(400).json({ status: 0, message: "OTP not matched" })
            }
        }).catch((err) => {
            console.log(err.message);
            return res.status(400).json({ status: 0, message: "Verification code not matched" })

        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}

// COMPLETE PROFILE
const completeProfile = async (req, res) => {
    try {
        if (!req.body._id) {
            return res.status(404).json({ status: 0, message: "ID is required" })
        } else {
            const user = await User.findOne({ _id: req.body._id, role: "vendor" })
            if (!user) {
                return res.status(400).send({ status: 0, message: "User not found" });
            } else {
                const updateUser = await User.findByIdAndUpdate({ _id: req.body._id, role: "vendor" },
                    {
                        number: req.body.number,
                        address: req.body.address,
                        city: req.body.city,
                        age: req.body.age
                    }, { new: true })

                if (updateUser) {
                    await updateUser.generateAuthToken()
                    res.status(200).json({ status: 1, message: "Profile Completed", updateUser })
                } else {
                    return res.status(400).json({ status: 0, message: "Something Went Wrong" })
                }
            }

        }
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }
}
//  SIGN IN
const signIn = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(404).json({ status: 0, message: "Email is required" })
        } else if (!req.body.password) {
            return res.status(404).json({ status: 0, message: "Password is required" })
        } else {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json({ status: 0, message: "User not found" })
            } else {
                const isMatch = await bcrypt.compare(req.body.password, user.password)
                if (!isMatch) {
                    return res.status(404).json({ status: 0, message: "Password not match" })
                } else {
                    const token = await user.generateAuthToken();
                    const updatedRecord = await User.findOneAndUpdate({ _id: user._id }, { isverified: 1, authentication: token }, { new: true });
                    return res.status(200).json({ status: 1, message: "Login Successful", data: updatedRecord })

                }
            }
        }
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).send(error.message);
    }
}


module.exports = { signUp, signIn, verifyUser, forgetPassword, resetPassword, updatePassword, completeProfile }