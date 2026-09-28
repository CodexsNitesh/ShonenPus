const express = require("express");

const router = express.Router();

const {
  saveOrder,
  saveDemoOrder,
  getOrders,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/save-order", authMiddleware, saveOrder);
router.post("/demo-order", authMiddleware, saveDemoOrder);

router.get("/orders", authMiddleware, getOrders);

module.exports = router;
