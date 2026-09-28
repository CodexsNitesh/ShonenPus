const crypto = require("crypto");
const Order = require("../models/order");
const Product = require("../models/product");
const User = require("../models/user");

const buildOrderProducts = async (cartItems) => {
  const productIds = cartItems.map((item) => item.productId);
  const products = await Product.find({ id: { $in: productIds } });

  return cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      return {
        id: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        new_price: product.new_price,
        old_price: product.old_price,
        size: item.size || "M",
        quantity: item.quantity,
      };
    })
    .filter(Boolean);
};

const getOrderTotal = (products) => {
  return products.reduce(
    (total, product) => total + product.new_price * product.quantity,
    0
  );
};

const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

exports.saveOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    const isValidPayment = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValidPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartItems = user.cart.filter((item) => item.quantity > 0);
    const products = await buildOrderProducts(cartItems);

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot save an empty order",
      });
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const order = new Order({
      userId: req.user.id,
      products,
      totalAmount: getOrderTotal(products),
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      shippingAddress,
      estimatedDelivery: deliveryDate,
    });

    await order.save();

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      message: "Order saved",
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Order save failed",
    });
  }
};

exports.saveDemoOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    const requiredFields = ["fullName", "address", "city", "pincode", "phone"];
    if (!shippingAddress || requiredFields.some((field) => !String(shippingAddress[field] || "").trim())) {
      return res.status(400).json({ success: false, message: "Please provide complete shipping details" });
    }
    if (!/^\d{6}$/.test(shippingAddress.pincode) || !/^\d{10}$/.test(shippingAddress.phone)) {
      return res.status(400).json({ success: false, message: "Please enter a valid pincode and 10 digit phone number" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const cartItems = user.cart.filter((item) => item.quantity > 0);
    const products = await buildOrderProducts(cartItems);
    if (!products.length) {
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const order = await Order.create({
      userId: req.user.id,
      products,
      totalAmount: getOrderTotal(products),
      paymentId: `demo_${Date.now()}`,
      paymentMode: "demo",
      shippingAddress,
      estimatedDelivery: deliveryDate,
    });

    user.cart = [];
    await user.save();
    return res.status(201).json({ success: true, message: "Demo order placed", order });
  } catch (error) {
    console.error("Demo order save failed:", error);
    return res.status(500).json({ success: false, message: "Order could not be saved" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch orders",
    });
  }
};
