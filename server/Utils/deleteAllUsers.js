import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Users from "../Models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Users.deleteMany({});
    console.log("✅ All users deleted");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
})();
