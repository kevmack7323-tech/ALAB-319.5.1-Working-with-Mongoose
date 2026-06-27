import connectDB from './db/conn.js';
import 'dotenv/config';
import mongoose from 'mongoose';
import express from "express";

const PORT = 3000;
const app = express();

import grades from "./routes/grades.js";

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API.");
});

app.use("/grades", grades);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere...");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
