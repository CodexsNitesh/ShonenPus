const router = require("express").Router();
const hostController = require("../controllers/hostController");


router.post("/add-product", hostController.addProduct)
router.post("/remove-product", hostController.removeProduct)
// router.post("/addtocart", hostController.addToCart);


module.exports = router;