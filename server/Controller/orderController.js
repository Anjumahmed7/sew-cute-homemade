import Orders from "../Models/orderModel.js";

// Create new order
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, totals } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "Failed", message: "No items in order" });
    }

    const order = await Orders.create({
      user: req.user?.id,
      items,
      shippingAddress,
      totals,
      payment: { method: "COD", status: "pending" },
    });

    res.status(201).json({ status: "Success", data: { order } });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Orders.find().sort("-createdAt");

    res
      .status(200)
      .json({ status: "Success", results: orders.length, data: { orders } });
  } catch (err) {
    next(err);
  }
};
