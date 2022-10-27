const mongoose = require('mongoose');
const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
}, {
    timestamps: true
});
const Categories = mongoose.model("Categories", categoriesSchema)

module.exports = Categories