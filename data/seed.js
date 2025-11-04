const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
require("dotenv").config();


const Service = require("../models/Service");
const Client = require("../models/Client");
const Booking = require("../models/Bookings");

const CLIENTES_CSV_PATH = path.join(__dirname, "csv", "clientes.csv");
const SERVICIOS_CSV_PATH = path.join(__dirname, "csv", "servicios.csv");
const BOOKINGS_CSV_PATH = path.join(__dirname, "csv", "servicios-cliente.csv");

const parseCSV = (path) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to database");
    await Client.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});

    const clientesData = await parseCSV(CLIENTES_CSV_PATH);
    const serviciosData = await parseCSV(SERVICIOS_CSV_PATH);
    const bookingsData = await parseCSV(BOOKINGS_CSV_PATH);

    // Seed Services
    const servicios = serviciosData.map((servicio) => ({
      name: servicio["Nombre Servicio"],
      price: parseFloat(servicio[ "Precio" ]),
      description:servicio["Descripción"] || "",
    }));
    const createdServicios = await Service.insertMany(servicios);
    console.log("Services seeded");

    // Seed Clients
    const clientes = clientesData.map((cliente) => ({
      name: cliente["Nombre"],    
      address: cliente["Dirección"],
      email: cliente["Email"],
      password: cliente[ "Password" ],
      role:"client",
    }));
    const createdClientes = await Client.insertMany(clientes);
    console.log("Clientes seeded");

    // Seed Bookings relaciones-
    const servicioMap = new Map(
      createdServicios.map((s) => [s.name, s._id])
    );
    const clienteMap = new Map(
      createdClientes.map((c) => [c.email, c._id])
    );
    //transformar bookingsData
    const bookingsTransformadas = [];
    for (const booking of bookingsData) {
      const clienteEmail = booking["Email Cliente"];
      const serviceName = booking["Servicio"];
      //IDs
      const clienteId = clienteMap.get(clienteEmail);
      const servicioId = servicioMap.get(serviceName);

      if (clienteId && servicioId) {
        const [fechaStr, horaStr] = [booking["Fecha Servicio"], booking.Hora];

        bookingsTransformadas.push({
          client: clienteId, // 👈 ID del Cliente
          service: servicioId, // 👈 ID del Servicio
          date: new Date(fechaStr),
          time: horaStr,
          status: booking.Estado,
        });
      } else {
        console.warn(
          `⚠️ No se pudo relacionar la booking. Email: ${
            clienteEmail || "N/A"
          } - Servicio: ${serviceName}. El registro será omitido.`
        );
      }
    }
    const createdBookings = await Booking.insertMany(bookingsTransformadas);
    console.log("bookings insertadas");
  } catch (error) {
    console.error("❌ Error al poblar la base de datos:", error);
    process.exit(1);
  } finally {
    // 4. Desconexión
    await mongoose.connection.close();
    console.log("🛑 MongoDB Desconectada. Proceso de seed terminado.");
  }
};
seedDB();
