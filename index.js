const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/connectDB");
//importar rutas
const clientRoutes = require("./routes/clientRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const authRoutes = require("./routes/authRoutes");
dotenv.config();
connectDB();

const app = express();
const PORT = 3000;
// Middlewares
app.use(cors()); 
app.use(express.json());
//routes
app.use("/clients", clientRoutes);
app.use("/services", serviceRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API de FullStack funcionando.");
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
