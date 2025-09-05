import Products from "../Models/productModel.js";

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Products.find(filter).sort("-createAt");

    res.status(200).json({
      status: "Success",
      results: products.length,
      data: { products },
    });
  } catch (err) {
    next(err);
  }
};

// Get single product by slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Products.findOne({ slug, isActive: true });

    if (!product) {
      return res
        .status(404)
        .json({ status: "failed", message: "Product not found" });
    }

    res.status(200).json({ status: "Success", data: { product } });
  } catch (er) {
    next(err);
  }
};
