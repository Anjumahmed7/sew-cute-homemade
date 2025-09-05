import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // If we don't have auth yet, leave it optional
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],

    totals: {
      itemsTotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },

    payment: {
      method: { type: String, enum: ["COD", "Stripe"], default: "COD" },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      transactionId: { type: String },
    },

    shippingAddress: {
      fullName: String,
      line1: String,
      city: String,
      region: String,
      postalCode: String,
      country: String,
      phone: String,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", orderSchema);
export default Orders;
