const Booking = require("models/Bookings");

exports.getClientBookings = async (req, res) => {
     const clientId = req.user.id;
    try {
        const bookings = await Booking.find({ client: clientId }).populate("service", "name price description").sort({ date: -1, time: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({error:"Error al obtener reservas"})
    }
}            
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate("service", "name price description");
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({error:"Error"})
    }
}
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(400).json({ message: "no se encontró" });            
        }
        res.status(200).json({ message: "eliminado" });
    } catch(error) {
        res.status(500).json({ error: "no se pudo eliminar la reserva" });
    }
}
exports.createBooking = async (req, res) => {
    const clientId = req.user.id;
    const { service, date, time, status } = req.body;
    if (!service || !date || !time) {
        return res.status(400).json({message:"faltan campos"})
    }
    try {
        const newBooking = new Booking({
            client: clientId,
            service: service,
            date: new Date(date),
            time: time,
            status: "confirmada"
        })
        await newBooking.save();
        await newBooking.populate("service", "name price description");
        res.status(201).json({
            message: "reserva creada",
            data: newBooking
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
        
    
}