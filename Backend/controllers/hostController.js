const productModel = require("../models/product");

exports.addProduct = async (req, res) => {

    const lastproduct = await productModel.findOne().sort({ id: -1 });
    const newID = lastproduct ? lastproduct.id + 1 : 1;

    const { name, image, category, new_price, old_price } =
      req.body;
    const product = new productModel({
      id: newID,
      name,
      image,
      category,
      new_price,
      old_price,
    });
    await product.save();
    console.log(product);
    res.json({
      success: true,
      message: "Product added successfully",
      product: product,
    });
};


exports.removeProduct = async (req, res, next) => {
  await productModel.findOneAndDelete({id: req.body.id})
  console.log("Removed");
  res.json(
    {
      success: true,
      message: "Product removed successfully"
    }
  );
}

