const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

router.get('/adminify', adminController.getAdminify);

router.get('/products', auth, permit("Admin"), adminController.getProducts);

router.get('/add-product', auth, permit("Admin"), adminController.getAddProduct);

router.post('/add-product', auth, permit("Admin"), adminController.postAddProduct);

router.get('/edit-product/:productId', auth, permit("Admin"), adminController.getEditProduct);

router.post('/edit-product/:productId', auth, permit("Admin"), adminController.postEditProduct);

router.post('/delete-product/:productId', auth, permit("Admin"), adminController.postDeleteProduct);

module.exports = router;
