const Cart = require("../models/cart");
const Product = require("../models/product");
const taxCalculator = require("../utils/taxCalculator");

// Add a product to the cart
async function addToCart(req, res) {
  const { userId, productId, quantity } = req.body;

  try {
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
  const { userId, productId } = req.params;

  try {
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
  const { userId } = req.params;

  try {
    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.item");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate taxes and total price for each item
    const itemsWithTotalPrice = cart.items.map((item) => {
      const product = item.item;
      const totalPrice = product.price * item.quantity;
      const tax = taxCalculator.calculateProductTax(product.price);
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
