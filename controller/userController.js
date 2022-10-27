const User = require("../models/User")

const socialLogin = async (req, res) => {
    try {
        const alreadyUserAsSocialToke = await User.findOne({ user_social_token: req.body.user_social_token })

        if (!req.body.user_social_token) {
            return res.status(400).send({ status: 0, message: 'User Social Token field is required' });
        }
        else if (!req.body.user_social_type) {
            return res.status(400).send({ status: 0, message: 'User Social Type field is required' });
        }
        else if (!req.body.user_device_type) {
            return res.status(400).send({ status: 0, message: 'User Device Type field is required' });
        }
        else if (!req.body.user_device_token) {
            return res.status(400).send({ status: 0, message: 'User Device Token field is required' });
        }
        else {
            const checkUser = await User.findOne({ user_social_token: req.body.user_social_token, role: "user" });
            if (!checkUser) {
                const newRecord = new User();
                newRecord.user_social_token = req.body.user_social_token,
                    newRecord.user_social_type = req.body.user_social_type,
                    newRecord.user_device_type = req.body.user_device_type,
                    newRecord.user_device_token = req.body.user_device_token
                newRecord.email = req.body.email,
                    newRecord.verified = 1
                newRecord.name = req.body.name
                newRecord.image = req.body.user_image,
                    newRecord.number = req.body.number
                newRecord.address = req.body.address
                newRecord.city = req.body.city
                newRecord.age = req.body.age
                const token = await newRecord.generateAuthToken();
                newRecord.authentication = token
                const saveLogin = await newRecord.save();
                return res.status(200).send({ status: 1, message: 'Login Successfully', saveLogin });
            } else {
                const token = await checkUser.generateAuthToken();
                const updatedRecord = await User.findOneAndUpdate({ _id: checkUser._id, role: "user" },
                    { user_device_type: req.body.user_device_type, user_device_token: req.body.user_device_token, verified: 1, authentication: token }
                    , { new: true });
                return res.status(200).send({ status: 1, message: 'Login Successfully', updatedRecord });
            }
        }
    }
    catch (error) {
        return res.status(500).json({ status: 0, message: error.message });
    }
}

const logOut = async (req, res) => {
    try {

        const user = await User.findOne({ _id: req.user._id, role: "user" })
        if (user.authentication === null) {
            return res.status(400).json({ status: 0, msg: "User already logOut" })
        } else {
            const logout = await User.findByIdAndUpdate({ _id: req.user._id, role: "user" }, { authentication: null, code: null, user_device_token: null, user_device_type: null, user_social_token: null, }, { new: true })
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

const editUser = async (req, res) => {

    try {
        const check = await User.findOne({ _id: req.user._id, role: "user" })
        if (!check) {
            return res.status(400).json({ status: 0, message: "User Not Found" })
        } else {
            const user = await User.findOneAndUpdate({ _id: req.user._id, role: "user" },
                {
                    email: req.body.email,
                    verified: 1,
                    name: req.body.name,
                    image: req.file ? req.file.path : req.body.user_image,
                    number: req.body.number,
                    address: req.body.address,
                    city: req.body.city,
                    age: req.body.age
                },
                { new: true })

            if (user) {
                return res.status(200).json({ status: 1, message: "User Updated Successfully" })
            } else {
                return res.status(400).json({ status: 0, message: "Something Went Wrong" })
            }
        }

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { socialLogin, logOut, editUser, editUser }