require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/product");
const dummyProducts = require("../data/dummyProducts");

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    for (const product of dummyProducts) {
      await Product.findOneAndUpdate(
        { id: product.id },
        product,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log(`Seeded ${dummyProducts.length} products`);
  } catch (error) {
    console.error("Failed to seed products:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
