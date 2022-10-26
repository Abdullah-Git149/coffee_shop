const User = require("../models/User")
const Cafe = require("../models/Cafe")
const bcrypt = require("bcryptjs")
const { sendEmail } = require("../utils/utils")


const addEmployee = async (req, res) => {

    try {
        const userex = await User.findOne({ email: req.body.email })
        const findCafe = await Cafe.findOne({ vendor_id: req.payload._id, _id: req.body.cafeId })
        if (!req.body.name) {
            return res.status(400).json({ status: 0, message: "Name is required" })
        } else if (!req.body.email) {
            return res.status(400).json({ status: 0, message: "Email is required" })
        } else if (userex) {
            return res.status(400).json({ status: 0, message: "Email Already Exist" })
        } else if (!req.body.address) {
            return res.status(400).json({ status: 0, message: "Address is required" })
        } else if (!req.body.city) {
            return res.status(400).json({ status: 0, message: "City is required" })
        } else if (!req.body.age) {
            return res.status(400).json({ status: 0, message: "Age is required" })
        } else if (!req.body.password) {
            return res.status(400).json({ status: 0, message: "Password is required" })
        } else if (findCafe.employee_id) {
            return res.status(400).json({ status: 0, message: "This Cafe already Assigned With Employee" })
        } else {

            const salt = 10
            const hashPassword = await bcrypt.hash(req.body.password, salt)
            const employe = new User({
                name: req.body.name,
                email: req.body.email,
                address: req.body.address,
                city: req.body.city,
                age: req.body.age,
                vendor_id: req.payload._id,
                cafe_id: req.body.cafeId,
                image: req.file ? req.file.path : req.body.employee_image,
                role: "employee",
                password: hashPassword
            })
            await employe.save()

            if (employe) {
                await Cafe.findOneAndUpdate({ _id: req.body.cafeId }, { employee_id: employe._id }, { new: true })
                return res.status(200).json({ status: 1, message: "Employee Created Successfully", employe })
            }
            else {
                return res.status(400).json({ status: 0, message: "This Employee already Assigned With Cafe" })
            }
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const employeeList = async (req, res) => {
    try {
        const emp = await User.find({ vendor_id: req.payload._id, role: "employee" })
        if (emp.length > 0) {
            return res.status(200).json({ status: 1, message: "List of Employee", emp })
        } else {
            return res.status(400).json({ status: 0, message: "No Employee Found" })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })

    }

}


const employeeEdit = async (req, res) => {
    try {
        const id = req.params.empId
        const salt = 10
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        const exemp = await User.findOne({ _id: id, vendor_id: req.payload._id, role: "employee" })
        const emp = await User.findOneAndUpdate({ _id: id, vendor_id: req.payload._id, role: "employee" },
            {
                name: req.body.name,
                address: req.body.address,
                city: req.body.city,
                age: req.body.age,
                number: req.body.number,
                password: req.body.password ? hashPassword : exemp.password,
                image: req.file ? req.file.path : req.body.employee_image,
            },
            {
                new: true
            })

        if (emp) {
            return res.status(200).json({ status: 1, message: "Edited Sucessfully", emp })
        } else {
            return res.status(400).json({ status: 0, message: "Something Went Wrong" })

        }

    } catch (error) {
        return res.status(500).json({ error: error.message })

    }

}



const employeeLogin = async (req, res) => {
    try {
        const emp = await User.findOne({ email: req.body.email, role: "employee" })
        if (!emp) {
            return res.status(400).json({ status: 0, message: "Employee not found" })
        } else {
            const isMatch = await bcrypt.compare(req.body.password, emp.password)
            if (!isMatch) {
                return res.status(404).json({ status: 0, message: "Password not match" })
            } else {
                const token = await emp.generateAuthToken();
                const updatedRecord = await User.findOneAndUpdate({ _id: emp._id, role: "employee" }, { isverified: 1, authentication: token }, { new: true });
                return res.status(200).json({ status: 1, message: "Login Successful", data: updatedRecord })
            }
        }

    } catch (error) {

        return res.status(500).json({ error: error.message })
    }
}

const employeeVerifyUser = async (req, res) => {
    try {
        if (!req.body._id) {
            return res.status(400).json({ status: 0, message: " Id is required" })
        } else if (!req.body.verficationCode) {
            return res.status(400).json({ status: 0, message: "verficationCode is required" })
        }
        await User.findOne({ _id: req.body._id, role: "employee" }).then((result) => {
            if (req.body.verficationCode == result.code) {
                User.findByIdAndUpdate({ _id: req.body._id, role: "employee" }, { verified: 1, code: null }, (error, result) => {
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



// FORGET PASSWORD
const employeeForgetPassword = async (req, res) => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ status: 0, message: "Email is required" });
        } else {
            const emp = await User.findOne({ email: req.body.email, role: "employee" })
            if (!emp) {
                return res.status(400).json({ status: 0, message: "User not found" });
            } else {
                const verficationCode = Math.floor(100000 + Math.random() * 900000)
                const newUser = await User.findByIdAndUpdate({ _id: emp._id, role: "employee" }, { code: verficationCode })
                if (newUser) {
                    sendEmail(emp, verficationCode)
                    return res.status(200).json({ status: 1, message: "Code successfully send to email : " + verficationCode, empId: newUser._id })
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


const employeeResetPassword = async (req, res) => {
    try {

        if (!req.body._id) {
            return res.status(400).json({ status: 0, message: "User id is required" })
        } else if (!req.body.password) {
            return res.status(400).json({ status: 0, message: "Please enter a password" })
        } else {
            const user = await User.findOne({ _id: req.body._id, role: "employee" })
            if (!user) {
                return res.status(400).json({ status: 0, message: "User not found" })
            } else {
                const hashPassword = await bcrypt.hash(req.body.password, 10)

                const hashedUser = await User.findOneAndUpdate({ _id: user._id, role: "employee" }, { password: hashPassword })
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
const employeeUpdatePassword = async (req, res) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ status: 0, message: "Please enter old password" })
        } else if (!req.body.emp_new_password) {
            return res.status(400).json({ status: 0, message: "Please enter new password" })
        }
        const emp = await User.findById(req.employee._id)
        const isMatch = await bcrypt.compare(req.body.password, emp.password)
        if (!isMatch) {
            return res.status(400).json({ status: 0, message: "Please enter correct old password" })
        } else {
            const hashPassword = await bcrypt.hash(req.body.emp_new_password, 10)
            const newUser = await User.findOneAndUpdate({ _id: req.employee._id, role: "employee" }, { password: hashPassword })
            await newUser.save()

            return res.status(200).json({ status: 1, message: "Password changed successfully" })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });

    }
}

//employeeEditProfile
const employeeEditProfile = async (req, res) => {
    try {

        const emp = await User.findOne({ _id: req.employee._id, role: "employee" })
        if (!emp) {
            return res.status(400).json({ status: 0, message: "Employee Not Found" })
        } else {
            if (!req.body.password) {
                const updateEmp = await User.findOneAndUpdate({ _id: req.employee._id, role: "employee" }, {
                    name: req.body.name,
                    address: req.body.address,
                    city: req.body.city,
                    age: req.body.age,
                    number: req.body.number,
                    image: req.file ? req.file.path : req.body.employee_image,
                })
                if (updateEmp) {
                    return res.status(200).json({ status: 1, message: "Employee Updated" })
                }
            } else {
                const isMatch = await bcrypt.compare(req.body.password, emp.password)
                if (!isMatch) {
                    return res.status(400).json({ status: 0, message: "Please enter correct old password" })
                } else {
                    if (!req.body.new_password) {
                        return res.status(400).json({ status: 0, message: "Please enter new password" })
                    } else {
                        const salt = 10
                        const hashPassword = await bcrypt.hash(req.body.new_password, salt)
                        // const exupdateEmp = await User.findOne({ _id: req.employee._id, role: "employee" })
                        const updateEmpp = await User.findOneAndUpdate({ _id: req.employee._id, role: "employee" }, {
                            name: req.body.name,
                            address: req.body.address,
                            city: req.body.city,
                            age: req.body.age,
                            number: req.body.number,
                            password: hashPassword,
                            image: req.file ? req.file.path : req.body.employee_image,
                        })
                        if (updateEmpp) {
                            return res.status(200).json({ status: 1, message: "Employee Updated" })
                        } else {
                            return res.status(400).json({ status: 0, message: "Something Went Wrong" });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

//employeelogOut
const employeelogOut = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.employee._id, role: "employee" })

        if (user.user_authentication === null) {
            return res.status(400).json({ status: 0, msg: "User already logOut" })
        } else {
            const logout = await User.findByIdAndUpdate({ _id: req.employee._id, role: "employee" }, { authentication: null, code: null }, { new: true })
            if (logout) {
                return res.status(200).json({ status: 1, msg: "Successfully logged out" })
            } else {
                return res.status(400).json({ status: 0, msg: "Something went wrong" })
            }
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}



module.exports = { addEmployee, employeeList, employeeEdit, employeeLogin, employeeEditProfile, employeeUpdatePassword, employeeForgetPassword, employeeVerifyUser, employeelogOut, employeeResetPassword }