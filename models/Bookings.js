const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
 
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  date: { type: Date },
  time: { type: String },
  status: { type: String, required: true, enum:["pendiente", "Realizado", "Cancelado"] },

  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Booking", BookingSchema)