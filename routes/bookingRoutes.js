const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");

// get user clients 
router.get("/", protect, bookingController.getClientBookings);

//create booking 
router.post("/", protect, bookingController.createBooking);

//delete booking 
routes.delete("/:id", protect, bookingController.deleteBooking);

//get all bookings 
router.get("/all", protect, bookingController.getAllBookings);