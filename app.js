const express = require("express");
const mongoose = require("mongoose");

// Connection DB
const PASSWORD = "BkVCTVeYl40E0jXh";
const USER = "gchariot";
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.3e1lccc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function connect() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connecté à la base de données");
  } catch (e) {
    console.error(e);
  }
}
connect();
module.exports = {};

const app = express();

app.use(express.json());

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

module.exports = app;
