const express = require("express");

const router = express.Router();

const {
  createOrder,
} = require("../controllers/paymentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create-order", authMiddleware, createOrder);

module.exports = router;
