const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/products', auth, adminController.getProducts);

router.get('/add-product', auth, adminController.getAddProduct);

router.post('/add-product', auth, adminController.postAddProduct);

router.get('/edit-product/:productId', auth, adminController.getEditProduct);

router.post('/edit-product/:productId', auth, adminController.postEditProduct);

router.post('/delete-product/:productId', auth, adminController.postDeleteProduct);

module.exports = router;
