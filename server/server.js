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

// // Middleware
// if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// app.use(express.json());
// app.use(cookieParser());

// // const allowed = [/^http:\/\/localhost:5173$/, /^http:\/\/127\.0\.0\.1:5173$/];
// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "http://127.0.0.1:5173",
// //   process.env.CLIENT_ORIGIN, // e.g. https://sew-cute-homemade.vercel.app
// //   process.env.CLIENT_ORIGIN_2, // optional extra (custom domain later)
// // ].filter(Boolean);

// // app.use(
// //   cors({
// //     origin: (origin, cb) => {
// //       if (!origin) return cb(null, true); // Postman / server-to-server / curl

// //       const ok = allowedOrigins.includes(origin) || vercelPreview.test(origin);

// //       return cb(ok ? null : new Error("Not allowed by CORS"), ok);
// //     },
// //     credentials: true, // send cookies
// //   })
// // );

// // Allowed explicit origins (env on Render)
// const allowList = new Set(
//   [
//     "http://localhost:5173",
//     "http://127.0.0.1:5173",
//     process.env.CLIENT_ORIGIN, // e.g. https://sew-cute-homemade-...vercel.app
//     process.env.CLIENT_ORIGIN_2, // optional custom domain
//   ].filter(Boolean)
// );

// // Allow any Vercel preview like https://<branch>-<project>.vercel.app
// const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

// const corsOrigin = (origin, cb) => {
//   // Non-browser / server-to-server requests (no Origin header) → allow
//   if (!origin) return cb(null, true);

//   const ok = allowList.has(origin) || vercelPreview.test(origin);
//   return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
// };

// app.use(cors({ origin: corsOrigin, credentials: true }));
// // some hosts are picky about explicit preflight:
// app.options("*", cors({ origin: corsOrigin, credentials: true }));

// // Health check
// app.get("/api/health", (_req, res) => {
//   res.json({ status: "ok", message: "Server is running ✅" });
// });

// // Mount Product Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);

// // Catch-all 404 (no path string => avoids path-to-regexp parsing)
// app.use((req, res) => {
//   res.status(404).json({
//     status: "Failed",
//     message: `Route ${req.originalUrl} not found`,
//   });
// });

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   try {
//     // Make sure your .env has MONGO_URI=...
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running at http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ DB connection failed:", error.message);
//     process.exit(1);
//   }
// };

// startServer();
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

// if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// app.use(express.json());
// app.use(cookieParser());

// // CORS
// const allowList = new Set(
//   [
//     "http://localhost:5173",
//     "http://127.0.0.1:5173",
//     process.env.CLIENT_ORIGIN,
//     process.env.CLIENT_ORIGIN_2,
//   ].filter(Boolean)
// );
// const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;

// // const corsOrigin = (origin, cb) => {
// //   if (!origin) return cb(null, true);
// //   const ok = allowList.has(origin) || vercelPreview.test(origin);
// //   return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
// // };
// const corsOrigin = (origin, cb) => {
//   if (!origin) return cb(null, true); // server-to-server / Postman / curl
//   const ok = allowList.has(origin) || vercelPreview.test(origin);
//   // debug line shows up in Render -> Logs
//   console.log(`[CORS] origin="${origin}" allowed=${ok}`);
//   return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
// };
// app.use(
//   cors({
//     origin: corsOrigin,
//     credentials: true, // allow cookies
//     optionsSuccessStatus: 204,
//   })
// );

// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }
//   next();
// });
// // app.use(cors({ origin: corsOrigin, credentials: true }));
// // If you *really* want explicit preflight handling, use regex:
// // app.options(/.*/, cors({ origin: corsOrigin, credentials: true }));
// // app.options("(.*)", cors({ origin: corsOrigin, credentials: true }));
// // app.options("(*)", cors({ origin: corsOrigin, credentials: true }));

// // Health
// app.get("/api/health", (_req, res) =>
//   res.json({ status: "ok", message: "Server is running ✅" })
// );

// // Routes
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
//     app.listen(PORT, () =>
//       console.log(`🚀 Server running at http://localhost:${PORT}`)
//     );
//   } catch (error) {
//     console.error("❌ DB connection failed:", error.message);
//     process.exit(1);
//   }
// };

// startServer();

// ------------------------------------------------------------------------------------

// server/server.js
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config.js";
import cookieParser from "cookie-parser";

// NOTE: Do NOT import "cors" and do NOT call app.use(cors(...))

import productRoutes from "./Routes/productRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

const app = express();

/* --------------------------- Core middleware --------------------------- */
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

/* ----------------------------- CORS SHIM ------------------------------- */
/**
 * We allow:
 * - localhost dev
 * - CLIENT_ORIGIN / CLIENT_ORIGIN_2 from env
 * - any *.vercel.app preview domain
 */
const allowList = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_ORIGIN,
    process.env.CLIENT_ORIGIN_2,
  ].filter(Boolean)
);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowList.has(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  return false;
}

// Apply headers for every request and short-circuit OPTIONS
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    } else {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }

    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );

    if (req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  }

  return res
    .status(403)
    .json({ status: "fail", message: `CORS blocked for ${origin}` });
});

/* ------------------------------ Health check --------------------------- */
app.get("/", (_req, res) => {
  res.status(200).send("Sew Cute Homemade API is running. See /api/health");
});
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", message: "Server is running ✅" })
);

/* -------------------------------- Routes -------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* ------------------------------ 404 handler ----------------------------- */
app.use((req, res) => {
  res.status(404).json({
    status: "Failed",
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ---------------------------- Start the server -------------------------- */
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in environment");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};
startServer();
