const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("../models");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("../routes"));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Kleene Cars API" });
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res
      .status(500)
      .json({
        status: "unhealthy",
        database: "disconnected",
        error: error.message,
      });
  }
});

// Error Handling Middleware
app.use(require("../middleware/errorHandler"));

// Initialize database connection (only once for Vercel)
let dbInitialized = false;

const initializeDatabase = async () => {
  if (!dbInitialized) {
    try {
      await sequelize.authenticate();
      console.log("Database connected successfully.");
      dbInitialized = true;
    } catch (error) {
      console.error("Database connection failed:", error);
      throw error;
    }
  }
};

// Initialize on first request
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

module.exports = app;
