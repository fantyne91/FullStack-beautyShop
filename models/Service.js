const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
 
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    offer: { type: String }, 
    img:{type:String},
})
module.exports = mongoose.model("Service", ServiceSchema);