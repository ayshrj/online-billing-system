const jwt = require("jsonwebtoken");
const Cart = require("../models/cart");
const Product = require("../models/product");
const taxCalculator = require("../utils/taxCalculator");

const JWT_SECRET_KEY = "A9#2klz$aW1XnF%qS3p@tJYdfK&8cBz";

// Add a product to the cart
async function addToCart(req, res) {
  // Check if the user is authenticated (valid token provided in the Authorization header)
  try {
    const token = req.headers.authorization.split(" ")[1];

    console.log("Received Token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token not provided" });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    console.log("Decoded Token:", decodedToken);

    const { productId, quantity } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user's cart or create a new cart if none exists
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the product is already in the cart
    const existingItem = cart.items.find((item) => item.item.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ item: productId, quantity });
    }

    // Save the cart
    await cart.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Remove a product from the cart
async function removeFromCart(req, res) {
  // Check if the user is authenticated (valid token provided in the Authorization header)
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token not provided" });
  }

  try {
    const { productId } = req.params;

    // Verify the token and extract the user ID
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if the product is in the cart
    const itemIndex = cart.items.findIndex((item) =>
      item.item.equals(productId)
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Remove the product from the cart
    cart.items.splice(itemIndex, 1);

    // Save the cart
    await cart.save();

    return res
      .status(200)
      .json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// View total bill
async function viewTotalBill(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token not provided" });
  }

  try {
    console.log("Received token:", token);
    const { userId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.item");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate taxes and total price for each item
    const itemsWithTotalPrice = cart.items.map((item) => {
      const product = item.item;
      const totalPrice = product.price * item.quantity;
      const tax = taxCalculator.calculateProductTax(product.price); // Tax calculation added
      return {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
        },
        quantity: item.quantity,
        totalPrice,
        tax,
        totalAmount: totalPrice + tax,
      };
    });

    // Calculate the total bill amount
    const totalBillAmount = itemsWithTotalPrice.reduce(
      (total, item) => total + item.totalAmount,
      0
    );

    return res
      .status(200)
      .json({ items: itemsWithTotalPrice, totalBillAmount });
  } catch (error) {
    console.error("Error viewing total bill:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  addToCart,
  removeFromCart,
  viewTotalBill,
};
