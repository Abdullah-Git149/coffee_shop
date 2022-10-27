const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require("path")
const vendorRoute = require("./routes/vendorRoute")
const cafeRoute = require("./routes/cafeRoute")
const employeeRoute = require("./routes/employeeRoute")
const userRoute = require("./routes/userRoute")
// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use('/upload', express.static('upload'));


app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(vendorRoute)
app.use(cafeRoute)
app.use(employeeRoute)
app.use(userRoute)






const PORT = process.env.PORT || 5000

dotenv.config()

// const contentSeeder = [
//     {
//         title: "Privacy Policy",
//         content: "This is privacy policy.",
//         type: "privacy_policy"
//     },
//     {
//         title: "Terms and Conditions",
//         content: "This is terms and conditions.",
//         type: "terms_and_conditions"
//     }
// ];
// const dbSeed = async () => {
//     await Content.deleteMany({});
//     await Content.insertMany(contentSeeder);
// }
// dbSeed().then(() => {
//     // mongoose.connection.close();
// })
mongoose.connect(
    process.env.DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
},
    () => console.log("DB Connected")
);




app.listen(PORT, (req, res) => {
    console.log(`Connection running on ${PORT}`);
})
