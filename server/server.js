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
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_ORIGIN, // e.g. https://sew-cute-homemade.vercel.app
  process.env.CLIENT_ORIGIN_2, // optional extra (custom domain later)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // Postman / server-to-server / curl

      const ok = allowedOrigins.includes(origin) || vercelPreview.test(origin);

      return cb(ok ? null : new Error("Not allowed by CORS"), ok);
    },
    credentials: true, // send cookies
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

// // server/server.js
// import express from "express";
// import mongoose from "mongoose";
// import morgan from "morgan";
// import cors from "cors";
// import "dotenv/config.js";
// import cookieParser from "cookie-parser";

// import productRoutes from "./Routes/productRoutes.js";
// import orderRoutes from "./Routes/orderRoutes.js";
// import authRoutes from "./Routes/authRoutes.js";

// const app = express();

// /* --------------------------- Core middleware --------------------------- */
// if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// app.use(express.json());
// app.use(cookieParser());

// /* -------------------------------- CORS --------------------------------- */
// /**
//  * Option B: only allow
//  *  - localhost (dev)
//  *  - CLIENT_ORIGIN (your stable Vercel prod domain)
//  *  - CLIENT_ORIGIN_2 (a single preview or custom domain)
//  *
//  * Add them in Render → Environment:
//  *   CLIENT_ORIGIN = https://sew-cute-homemade.vercel.app
//  *   CLIENT_ORIGIN_2 = https://sew-cute-homemade-<preview>.vercel.app
//  */
// const allowList = new Set(
//   [
//     "http://localhost:5173",
//     "http://127.0.0.1:5173",
//     process.env.CLIENT_ORIGIN,
//     process.env.CLIENT_ORIGIN_2,
//   ].filter(Boolean)
// );

// const corsOrigin = (origin, cb) => {
//   // No origin = server-to-server, curl, Postman, same-origin
//   if (!origin) return cb(null, true);
//   const ok = allowList.has(origin);
//   return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
// };

// app.use(cors({ origin: corsOrigin, credentials: true }));
// // Explicitly handle preflight for all routes
// app.options("*", cors({ origin: corsOrigin, credentials: true }));

// /* ------------------------------ Health check --------------------------- */
// // Friendly root (also helps Render root checks)
// app.get("/", (_req, res) => {
//   res.status(200).send("Sew Cute Homemade API is running. Try /api/health");
// });

// app.get("/api/health", (_req, res) => {
//   res.json({ status: "ok", message: "Server is running ✅" });
// });

// /* -------------------------------- Routes -------------------------------- */
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// /* ------------------------------ 404 handler ----------------------------- */
// app.use((req, res) => {
//   res.status(404).json({
//     status: "Failed",
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

// /* ---------------------------- Start the server -------------------------- */
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error("Missing MONGO_URI in environment");
//     }
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ Startup failed:", error.message);
//     process.exit(1);
//   }
// };

// startServer();
