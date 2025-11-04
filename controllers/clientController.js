const Client = require("../models/Client");



exports.getClients = async (req, res) => {
  try {
    const client = await Client.find();
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};
exports.getClientID = async (req, res) => {
  try {
    const client = await Client.find(req.params.id);
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};
exports.updateClient = async (req, res) => {
  try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
      if (!client) {
            return res.status(404).json({ message: "Client not found" });
      }
    res.status(200).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Error creating client", error });
  }
};
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting client", error });
    }
};