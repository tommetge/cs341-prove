// const mongod = require('mongodb');

// const dateFormat = require('../util/date');

// const Product = require('../models/product');
// const Cart = require('../models/cart');
// const Order = require('../models/order');

// exports.getProducts = async (req, res, next) => {
//   const products = await Product.find();
//   res.render('shop/product-list', {
//     prods: products,
//     pageTitle: 'Shop',
//     path: '/'
//   });
// }

// exports.getProduct = async (req, res, next) => {
//   const productId = req.params.productId;
//   const product = await Product.findById(productId); 
//   res.render('shop/product-detail', {
//     product: product,
//     pageTitle: product.title,
//     path: '/products'
//   });
// }

// exports.getIndex = async (req, res, next) => {
//   const products = await Product.find();
//   res.render('shop/index', {
//     prods: products,
//     pageTitle: 'Create Your Own Adventure',
//     path: '/'
//   });
// }

// exports.getCart = async (req, res, next) => {
//   const products = await Product.find();
//   if (!req.cart.products) {
//     req.cart.products = new Map();
//   }
//   filteredProducts = products.filter(product => req.cart.products.has(product._id.toString()));
//   const myCart = filteredProducts.map(product => {
//     return {
//       product: product,
//       qty: req.cart.products.get(product._id.toString())
//     }
//   });
//   myCart.totalPrice = await req.cart.totalPrice();

//   res.render('shop/cart', {
//     products: myCart,
//     path: '/cart',
//     pageTitle: 'Your Cart'
//   });
// }

// exports.getModifyCart = async (req, res, next) => {
//   const productId = req.query.product_id;
//   const product = await Product.findById(productId);
//   if (req.query.remove == '1') {
//     await req.cart.removeProduct(product);
//     res.redirect('/cart');
//     return;
//   }

//   if (req.query.add == '1') {
//     await req.cart.addProduct(product);
//     res.redirect('/cart');
//     return;
//   }

//   res.redirect('/cart');
// }

// exports.postCart = async (req, res, next) => {
//   const productId = req.body.product_id;
//   const product = await Product.findById(productId);
//   if (req.body.delete_item === '1') {
//     const result = await req.cart.deleteProduct(productId)
//     res.redirect('/cart');
//     return result;
//   }

//   const result = await req.cart.addProduct(product);
//   res.redirect('/cart');
//   return result;
// }

// exports.getOrders = async (req, res, next) => {
//   const orders = await Order.find({ user_id: req.user._id });
//   const products = await Product.find();
//   const myOrders = [];
//   for (order of orders) {
//     const filteredProducts = products.filter(product => order.products.has(product._id.toString()));
//     const myProducts = filteredProducts.map(product => {
//       return {
//         product: product,
//         qty: order.products.get(product._id.toString())
//       }
//     });
//     const total = await order.totalPrice();
//     myOrders.push({ products: myProducts, order_id: order._id, total: total, created_at: dateFormat(order.created_at) });
//   }
//   res.render('shop/orders', {
//     orders: myOrders,
//     path: '/orders',
//     pageTitle: 'Your Orders'
//   });
// }

// exports.getOrder = async (req, res, next) => {
//   const order = await Order.findById(req.params.order_id);
//   const products = await Product.find();
//   const filteredProducts = products.filter(product => order.products.has(product._id.toString()));
//   const myOrder = filteredProducts.map(product => {
//     return {
//       product: product,
//       qty: order.products.get(product._id.toString())
//     }
//   });
//   myOrder.totalPrice = await order.totalPrice();
//   res.render('shop/order', {
//     products: myOrder,
//     path: '/order',
//     pageTitle: 'Your Order'
//   })
// }

// exports.getCheckout = async (req, res, next) => {
//   const products = await Product.find();
//   const filteredProducts = products.filter(product => req.cart.products.has(product._id.toString()));
//   const myCart = filteredProducts.map(product => {
//     return {
//       product: product,
//       qty: req.cart.products.get(product._id.toString())
//     }
//   });
//   myCart.totalPrice = await req.cart.totalPrice();
//   res.render('shop/checkout', {
//     products: myCart,
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// }

// exports.postCheckout = async (req, res, next) => {
//   const order = new Order();
//   order.copyFromCart(req.cart);
//   await order.save();
//   await req.cart.reset();
//   res.redirect('/orders/' + order._id);
// }
