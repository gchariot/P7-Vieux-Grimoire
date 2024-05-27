require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");

const app = express();
app.use(express.json());

// Connection DB
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const DB_CLUSTER = process.env.DB_CLUSTER;
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@${DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

async function connect() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connexion à MangoDB réussie !");
  } catch (e) {
    console.error(e);
  }
}
connect();
module.exports = {};

// Gestion erreurs CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

const path = require("path");
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
