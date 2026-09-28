const mongoose = require("mongoose");
// const productSchema = require('../../Frontend/src/assets')
// import all_product from "../../Frontend/src/assets/all_product";

// Sceham For Product
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model("Product", productSchema);