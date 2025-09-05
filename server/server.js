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

// const allowed = [/^http:\/\/localhost:5173$/, /^http:\/\/127\.0\.0\.1:5173$/];
// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://127.0.0.1:5173",
//   process.env.CLIENT_ORIGIN, // e.g. https://sew-cute-homemade.vercel.app
//   process.env.CLIENT_ORIGIN_2, // optional extra (custom domain later)
// ].filter(Boolean);

// // app.use(
// //   cors({
// //     origin: (origin, cb) => {
// //       if (!origin) return cb(null, true); // Postman / server-to-server
// //       const ok = allowed.some((rx) => rx.test(origin));
// //       cb(ok ? null : new Error("Not allowed by CORS"), ok);
// //     },
// //     credentials: true,
// //   })
// // );
// app.use(
//   cors({
//     origin: (origin, cb) => {
//       if (!origin) return cb(null, true); // Postman / server-to-server / curl

//       const ok = allowedOrigins.includes(origin) || vercelPreview.test(origin);

//       return cb(ok ? null : new Error("Not allowed by CORS"), ok);
//     },
//     credentials: true, // send cookies
//   })
// );

// // CORS
// // const allowList = new Set(
// //   [
// //     "http://localhost:5173",
// //     "http://127.0.0.1:5173",
// //     process.env.CLIENT_ORIGIN, // e.g. https://sew-cute-homemade.vercel.app
// //     process.env.CLIENT_ORIGIN_2, // optional extra (custom domain later)
// //   ].filter(Boolean)
// // );

// // // allow any vercel preview URL: https://<branch>-<project>.vercel.app
// // const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

// // const corsOrigin = (origin, cb) => {
// //   if (!origin) return cb(null, true); // Postman/cURL/server-to-server
// //   const ok = allowList.has(origin) || vercelPreview.test(origin);
// //   return cb(ok ? null : new Error(`Not allowed by CORS: ${origin}`), ok);
// // };

// // app.use(cors({ origin: corsOrigin, credentials: true }));
// // // handle preflight explicitly (some hosts are picky)
// // app.options("*", cors({ origin: corsOrigin, credentials: true }));

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

// server/server.js
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

/* --------------------------- Core middleware --------------------------- */
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

/* -------------------------------- CORS --------------------------------- */
/**
 * Allow:
 *  - Local dev (5173)
 *  - Production frontend from env: CLIENT_ORIGIN
 *  - Optional extra domain: CLIENT_ORIGIN_2 (custom domain later)
 *  - (Optional) Any Vercel preview: https://<anything>.vercel.app
 *    -> set ALLOW_VERCEL_PREVIEWS=true in env to enable
 */
const allowList = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_ORIGIN, // e.g. https://sew-cute-homemade.vercel.app
    process.env.CLIENT_ORIGIN_2, // e.g. https://your-custom-domain.com
  ].filter(Boolean)
);

// Opt-in flag for allowing ANY vercel preview URLs while developing
const ALLOW_VERCEL_PREVIEWS =
  (process.env.ALLOW_VERCEL_PREVIEWS || "false").toLowerCase() === "true";

// Matches: https://<branch-or-hash>.<project>.vercel.app OR https://<project>-<hash>-user.vercel.app
const vercelPreviewRE = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

const corsOrigin = (origin, cb) => {
  // No origin = server-to-server, curl, Postman, same-origin fetch, etc.
  if (!origin) return cb(null, true);

  const allowed =
    allowList.has(origin) ||
    (ALLOW_VERCEL_PREVIEWS && vercelPreviewRE.test(origin));

  return cb(
    allowed ? null : new Error(`Not allowed by CORS: ${origin}`),
    allowed
  );
};

app.use(
  cors({
    origin: corsOrigin,
    credentials: true, // allow cookies to be sent
  })
);

// Some hosts require explicit preflight handling
app.options("*", cors({ origin: corsOrigin, credentials: true }));

/* ------------------------------ Health check --------------------------- */
app.get("/", (_req, res) => {
  res.status(200).send("Sew Cute Homemade API is running. Try /api/health");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Server is running ✅" });
});

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

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
