const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
}

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  });
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
}

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      // const filteredProducts = products.filter(product => cart.products.has(product.uuid));
      // filteredProducts.map(product => { return { product: product, qty: cart.products[product.uuid].qty } });
      const cartProducts = [];
      for (product of products) {
        if (!cart.products.has(product.uuid)) {
          continue;
        }

        cartProducts.push({
          product: product,
          qty: cart.products.get(product.uuid).qty
        });
      }

      res.render('shop/cart', {
        products: cartProducts,
        path: '/cart',
        pageTitle: 'Your Cart'
      });
    });
  });
}

exports.postCart = (req, res, next) => {
  const productId = req.body.product_id;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price, err => {
      res.redirect('/cart');
    });
  });
}

exports.postDeleteCartItem = (req, res, next) => {
  const productId = req.body.product_id;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, err => {
      res.redirect('/cart');
    });
  });
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
}
