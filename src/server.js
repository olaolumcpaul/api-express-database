const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { Pool } = require("pg");
const booksRouter = require("./routers/books.js");
const petsRouter = require("./routers/pets.js");

// Set up a connection to the database
const pool = new Pool({
  user: "neondb_owner",
  host: "ep-damp-butterfly-a5ikepwz.us-east-2.aws.neon.tech",
  database: "neondb",
  password: "2lI6UfidxAPz",
  port: 5432,
  ssl: true,
});

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Implement books and pets APIs using Express Modular Routers
app.use("/books", booksRouter(pool));
app.use("/pets", petsRouter(pool));

module.exports = app;
