require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const specRoutes = require("./routes/specRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
connectDB();
const PORT = process.env.PORT || 5001;


const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "https://spec-forge-frontend.vercel.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// API routes
app.get("/", (_, res) => res.json({ message: "SpecForge API", version: "1.0.0" }));
app.use("/api", specRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
