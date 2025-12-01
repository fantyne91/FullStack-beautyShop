const Client = require("../models/Client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: "30d" });
}

exports.registerClient = async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
        const existingClient = await Client.findOne({ email });
        
        if (existingClient) {
            return res.status(400).json({ message: "Client already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new Client({
          name,
          email,
          password: hashedPassword,
          address,
        });
        await newClient.save();
        const token = generateToken(newClient._id);
        res.status(201).json({
          token,
          name: newClient.name,
          email: newClient.email,
          id: newClient._id,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
          const messages = Object.values(error.errors).map(
            (val) => val.message
          );
          // Devolver 400 y los mensajes de error claros
          return res
            .status(400)
            .json({ message: `Error de Validación: ${messages.join(", ")}` });
        }

        // 🚨 Fallback para errores 500 genéricos (e.g., error en bcrypt, token, DB caído)
        console.error("Error interno del servidor (500):", error);
        res.status(500).json({
          message: "Error interno del servidor.",
          details: error.message, // Devolvemos el mensaje del error interno para debug
        });
    }
}

exports.loginClient = async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await Client.findOne({ email })
        if (!client) {
            res.status(401).json({message:"No existe el user"})
        }
        const isPasswordValid = await bcrypt.compare(password, client.password);
        if (!isPasswordValid) {
            res.status(401).json({message:"credenciales inválidas"})
        }
        const token = generateToken(client._id);
        res.status(200).json({ token,_id:client._id, name:client.name, email:client.email, role:client.role });
    } catch (err) {
        res.status(500).json({message:"Error en login",details: err.message})
    }
}