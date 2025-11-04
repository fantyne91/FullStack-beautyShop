const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({

    name: { type: String, required: true },
    address: { type: String },
    email: { type: String, lowercase: true, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: [ "client", "admin" ], default: "client" },
    createdAt: { type: Date, default: Date.now }
    
});
module.exports = mongoose.model("Client", ClientSchema);