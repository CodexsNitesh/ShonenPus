const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')

router.get('/allproducts', storeController.getallProducts);
router.get('/newcollections', storeController.newCollections);
router.get('/popularinwomen', storeController.popularInWomen);

module.exports = router;