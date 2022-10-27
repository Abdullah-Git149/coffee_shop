const nodemailer = require("nodemailer");
const multer = require("multer")
// var FCM = require("fcm-node");
const Vendor = require("../models/User")

// const SERVER_fIREBASE = "AAAAFWa4sIg:APA91bHjZQ0EHiO_Fcm8NjXIkXzOlPnGgvufPikZy9GuDyaFal9bhc_uANiFawLY-EL_WDx6eRNCe3uDKvAI49kWxbtH3cQuxO04v1BZfNhvcGcU3Cfqv0Ur6ep5YPxhzTpo6XC5vJSP"


// var fcm = new FCM(SERVER_fIREBASE);

// ============= NODE MAILER ============= 

var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "458eedd80819d8",
        pass: "10d673c1a0469e"
    }
})

const sendEmail = (user, verificationCode) => {
    // console.log(vendor, verificationCode)
    const mailOptions = {
        from: "noreply@server.appsstaging.com",
        to: user.email,
        subject: 'Verify Your Account Through One Time Password',
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
             <div style="margin:50px auto;width:70%;padding:20px 0">
                 <div style="border-bottom:1px solid #eee">
              <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Coupon App User Verification</a>
             </div>
                <p style="font-size:1.1em">Hi, ${user.name ? user.name : "User"}</p>
             <p>Thank you for choosing Our Brand. Use the following OTP to complete your Sign Up procedures.</p>
              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${verificationCode}</h2>
                 <p style="font-size:0.9em;">Regards,<br />Coffee Shop</p>
            <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  </div>
              </div>
             </div>`
    }
    transporter.sendMail(mailOptions, function (err, result) {
        if (err) console.log(err)
        else console.log(result);
    })
}

// ===================== MULTER =====================



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname == "cafe_image") {
            cb(null, './upload/cafe/')
        } else if (file.fieldname == "employee_image") {
            cb(null, './upload/employee/')
        } else if (file.fieldname == "product_image") {
            cb(null, './upload/product/')
        } else if (file.fieldname == "user_image") {
            cb(null, './upload/user/')
        }
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)

    }
})

function fileFilter(req, file, cb) {
    cb(null, true)
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/jfif") {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

// ================== PUSH NOTIFICATIONS ============= 


// const push_notification = async (job) => {

//     const user = await User.findOne({ _id: job.user_id })
//     console.log("data of paylaod", user);

//     var message = {
//         to: user,
//         collapse_key: "your_collapse_key",
//         notification: {
//             title: "Royalty Nurse",
//             body: "Your request has been accepted",
//         },
//         data: {
//             job: job
//         }
//     }

//     fcm.send(message, function (err, response) {
//         if (err) {
//             console.log("Something has gone wrong!", err);
//         } else {
//             console.log("Successfully sent with response: ", response);

//         }
//     })

// }

module.exports = { sendEmail, upload }