import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number },
    sku: { type: String },
    category: {
      type: String,
      enum: ["towels", "robes", "apparel", "accessories"],
      required: true,
    },
    colors: [{ type: String }],
    sizes: [{ type: String }], // e.g. ["S","M","L"] or towel size
    material: { type: String, default: "" }, // e.g. "100% Cotton, 600 GSM"
    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", productSchema);

export default Products;
