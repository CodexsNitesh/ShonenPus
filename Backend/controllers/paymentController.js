const Product = require("../models/product");
const User = require("../models/user");

const getUserCartTotal = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const cartItems = user.cart.filter((item) => item.quantity > 0);
  if (cartItems.length === 0) {
    return { totalAmount: 0, cartItems: [] };
  }

  const productIds = cartItems.map((item) => item.productId);
  const products = await Product.find({ id: { $in: productIds } });

  const totalAmount = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    return product ? total + product.new_price * item.quantity : total;
  }, 0);

  return { totalAmount, cartItems };
};

exports.createOrder = async (req, res) => {
  try {
    const { totalAmount } = await getUserCartTotal(req.user.id);

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    res.json({
      success: true,
      mode: "demo",
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      message: "Demo payment mode is active. No payment was collected.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Payment order creation failed",
    });
  }
};
