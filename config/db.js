const mongoose = require("mongoose");

/**
 * Connects to MongoDB. Does not exit on failure so API can still serve /generate.
 */
async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/specforge";
  try {
    const conn = await mongoose.connect(uri, { maxPoolSize: 10 });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.error("API will run, but /api/spec, /api/specs will fail until DB is up.");
  }
}

module.exports = connectDB;
