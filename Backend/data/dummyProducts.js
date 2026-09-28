// const imageBaseUrl = process.env.API_BASE_URL || "http://localhost:3000";
const imageBaseUrl = process.env.BACKEND_URL || "https://shonenpus.onrender.com";


const products = [
  ["Women", "Floral Wrap Peplum Blouse", 50, 80.5],
  ["Women", "Soft Cotton Summer Top", 85, 120.5],
  ["Women", "Pleated Sleeve Casual Shirt", 60, 100.5],
  ["Women", "Classic Fit Denim Jacket", 100, 150],
  ["Women", "Everyday Ribbed Knit Tee", 85, 120.5],
  ["Women", "Printed Button Front Blouse", 85, 120.5],
  ["Women", "Relaxed Linen Tunic", 85, 120.5],
  ["Women", "Embroidered Collar Top", 85, 120.5],
  ["Women", "Slim Fit Office Shirt", 85, 120.5],
  ["Women", "Lightweight Layered Blouse", 85, 120.5],
  ["Women", "Soft Pastel Casual Top", 85, 120.5],
  ["Women", "Modern V Neck Shirt", 85, 120.5],
  ["Men", "Regular Fit Checked Shirt", 85, 120.5],
  ["Men", "Stretch Cotton Polo Shirt", 85, 120.5],
  ["Men", "Classic Black Denim Jacket", 85, 120.5],
  ["Men", "Slim Fit Oxford Shirt", 85, 120.5],
  ["Men", "Casual Crew Neck T Shirt", 85, 120.5],
  ["Men", "Lightweight Bomber Jacket", 85, 120.5],
  ["Men", "Everyday Solid Hoodie", 85, 120.5],
  ["Men", "Tapered Fit Chinos", 85, 120.5],
  ["Men", "Soft Knit Sweater", 85, 120.5],
  ["Men", "Relaxed Graphic Tee", 85, 120.5],
  ["Men", "Formal Blue Shirt", 85, 120.5],
  ["Men", "Weekend Utility Overshirt", 85, 120.5],
  ["Kids", "Colorblock Cotton Hoodie", 85, 120.5],
  ["Kids", "Playtime Printed Tee", 85, 120.5],
  ["Kids", "Soft Jogger Set", 85, 120.5],
  ["Kids", "Denim Dungaree Outfit", 85, 120.5],
  ["Kids", "Bright Summer Shirt", 85, 120.5],
  ["Kids", "Comfy School Sweatshirt", 85, 120.5],
  ["Kids", "Cartoon Print T Shirt", 85, 120.5],
  ["Kids", "Casual Pull On Pants", 85, 120.5],
  ["Kids", "Pocket Detail Jacket", 85, 120.5],
  ["Kids", "Everyday Striped Tee", 85, 120.5],
  ["Kids", "Soft Winter Sweater", 85, 120.5],
  ["Kids", "Festive Casual Shirt", 85, 120.5],
];

module.exports = products.map(([category, name, new_price, old_price], index) => {
  const id = index + 1;
  const imageNumber = id === 33 ? 32 : id;

  return {
    id,
    name,
    category,
    image: `${imageBaseUrl}/images/product_${imageNumber}.png`,
    new_price,
    old_price,
    available: true,
  };
});
