const Service = require("../models/Service");

exports.createService = async (req, res) => {
    try {
        const newService = new Service(req.body)
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: "Error creating service", error });
    }
}
exports.getServices = async (req, res) => {
  try {
    const service = await Service.find();
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error finding service", error });
  }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
    } catch (error) {
        res.status(500).json({ message: "Error deleting service", error });
    }
}

exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: "Error updating service", error });
    }
}