const express = require('express');

const shopController = require('../controllers/shop');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/product/:productId', shopController.getProduct);

router.get('/cart', auth, shopController.getCart);

router.post('/cart', auth, shopController.postCart);

router.get('/cart/modify', auth, shopController.getModifyCart);

router.get('/orders', auth, shopController.getOrders);

router.get('/orders/:order_id', auth, shopController.getOrder);

router.get('/checkout', auth, shopController.getCheckout);

router.post('/checkout', auth, shopController.postCheckout);

module.exports = router;
