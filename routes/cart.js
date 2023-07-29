const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.delete("/remove/:userId/:productId", cartController.removeFromCart);
router.get("/total-bill/:userId", cartController.viewTotalBill);

module.exports = router;
