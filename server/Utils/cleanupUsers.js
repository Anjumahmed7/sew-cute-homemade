import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Users from "../Models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env
dotenv.config({ path: path.join(__dirname, "../.env") });

async () => {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGO_URL;

    if (!uri) throw new Error("Missing URI/URL");

    await mongoose.connect(uri);
    console.log("Connected to MONGODB");

    // Group by lowercased email to catch case variants
    const dups = await Users.aggregate([
      { $project: { emailLower: { $toLower: "$email" }, createdAt: 1 } },
      {
        $group: {
          _id: "$emailLower",
          ids: { $push: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ]);

    if (dups.length === 0) {
      console.log("No duplicates");
    } else {
      console.log(`Found ${dups.length} duplicate email(s). Cleaning...`);

      for (const g of dups) {
        const docs = await Users.find({ _id: { $in: g.ids } }).sort(
          "createdAt"
        );
        const keepId = docs[0]._id;
        const toRemove = docs.slice(1).map((d) => d._id);
        if (toRemove.length) {
          await Users.deleteMany({ _id: { $in: toRemove } });
          console.log(
            `Email ${g._id}: kept ${keepId}, removed ${toRemove.length}`
          );
        }
      }
    }

    await Users.syncIndexes();
    console.log("Synced indexes on Users");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {}
};
