const Product = require("../models/product");

const JWT_SECRET_KEY = "A9#2klz$aW1XnF%qS3p@tJYdfK&8cBz"; // Replace with your secret key
// Fetch all products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createProduct(req, res) {
  const { name, price } = req.body;

  try {
    // Create a new product instance
    const newProduct = new Product({ name, price });

    // Save the product to the database
    await newProduct.save();

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getAllProducts,
  createProduct,
};
