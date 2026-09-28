const User = require("../models/user");
const Product = require("../models/product");

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size = "M" } = req.body;
    const quantity = Math.max(1, Number(req.body.quantity || 1));

    if (typeof productId !== 'number') {
      return res.status(400).json({ message: "Product ID must be a number" });
    }

    // Optional: Check if product exists
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);

    const selectedSize = String(size).toUpperCase();
    const existingItem = user.cart.find(
      item => item.productId === productId && (item.size || "M") === selectedSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, size: selectedSize, quantity });
    }

    await user.save();

    res.status(200).json({
      message: "Product added to cart",
      cart: user.cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add to cart",
      error: err.message,
    });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch product details for each cart item based on numeric `productId`
    const productIds = user.cart.map(item => item.productId);
    const products = await Product.find({ id: { $in: productIds } });

    // Merge product info with quantities
    const cartWithDetails = user.cart.map(item => {
      return {
        productId: item.productId,
        size: item.size || "M",
        quantity: item.quantity,
      };
    });

    res.status(200).json({
      success: true,
      cart: cartWithDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
      error: err.message,
    });
  }
};


exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, size = "M" } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const selectedSize = String(size).toUpperCase();
    const itemIndex = user.cart.findIndex(
      item => item.productId === productId && (item.size || "M") === selectedSize
    );

    if (itemIndex > -1) {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      } else {
        // Remove the item completely
        user.cart.splice(itemIndex, 1);
      }
    }

    await user.save();
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: err.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: err.message,
    });
  }
};
