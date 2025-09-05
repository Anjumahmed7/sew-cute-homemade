// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Products from "../Models/productModel.js";

// dotenv.config({ path: "../.env" });

// server/seed/seedProducts.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Products from "../Models/productModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ load server/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const sampleProducts = [
  {
    name: "Hand Towel - Blue Leaves",
    slug: "blue-leaves",
    price: 7.5,
    images: ["/images/towels/blue-leaves.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with blue leaf pattern.",
    isActive: true,
  },
  {
    name: "Hand Towel - Brown Pink Leaves",
    slug: "brown-pink-leaves",
    price: 7.5,
    images: ["/images/towels/brown-pink-leaves.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with brown and pink leaves design.",
    isActive: true,
  },
  {
    name: "Hand Towel - Green Leaves",
    slug: "green-leaves",
    price: 7.5,
    images: ["/images/towels/green-leaves.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with green leaves pattern.",
    isActive: true,
  },
  {
    name: "Hand Towel - Green Red Flowers",
    slug: "green-red-flowers",
    price: 7.5,
    images: ["/images/towels/green-red-flowers.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with green and red flower design.",
    isActive: true,
  },
  {
    name: "Hand Towel - Pink Flowers",
    slug: "pink-flowers",
    price: 7.5,
    images: ["/images/towels/pink-flowers.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with pink floral pattern.",
    isActive: true,
  },
  {
    name: "Hand Towel - Red Strawberry",
    slug: "red-strawberry",
    price: 7.5,
    images: ["/images/towels/red-strawberry.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with red strawberry design.",
    isActive: true,
  },
  {
    name: "Hand Towel - Red Strawberry ii",
    slug: "red-strawberry-2",
    price: 7.5,
    images: ["/images/towels/red-strawberry-2.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with red strawberry variation.",
    isActive: true,
  },
  {
    name: "Hand Towel - Red White Checks",
    slug: "red-white-checks",
    price: 7.5,
    images: ["/images/towels/red-white-checks.jpg"],
    category: "hand-towels",
    description: "Handmade cotton towel with red and white checkered pattern.",
    isActive: true,
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Ensure unique indexes match your schema (won’t drop data)
    await Products.syncIndexes();

    // ✅ upsert by slug (create if missing, update if exists)
    await Products.bulkWrite(
      sampleProducts.map((p) => ({
        updateOne: {
          filter: { slug: p.slug },
          update: { $set: p },
          upsert: true,
        },
      }))
    );

    console.log("✅ Products seeded/updated");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
})();
