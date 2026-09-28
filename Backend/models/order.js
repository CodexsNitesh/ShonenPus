const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  products: {
    type: Array,
    required: true,
  },

  totalAmount: {
    type: Number,
    required: true,
  },

  paymentId: {
    type: String,
    required: true,
  },

  razorpayOrderId: {
    type: String,
  },
  paymentMode: { type: String, default: "demo" },

  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
  },

  status: {
    type: String,
    default: "Order Placed",
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  estimatedDelivery: {
    type: Date,
  },

  trackingSteps: {
    type: Array,
    default: [
        "Order Placed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
    ]
  },

  currentStep: {
    type: Number,
    default: 0  
  }
});

module.exports =
mongoose.model("Order", orderSchema);
