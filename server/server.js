import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";

import productRoutes from "./Routes/productRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

const app = express();

// Middleware
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

const allowed = [/^http:\/\/localhost:5173$/, /^http:\/\/127\.0\.0\.1:5173$/];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman / server-to-server
      const ok = allowed.some((rx) => rx.test(origin));
      cb(ok ? null : new Error("Not allowed by CORS"), ok);
    },
    credentials: true,
  })
);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running ✅" });
});

// Mount Product Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Catch-all 404 (no path string => avoids path-to-regexp parsing)
app.use((req, res) => {
  res.status(404).json({
    status: "Failed",
    message: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Make sure your .env has MONGO_URI=...
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
