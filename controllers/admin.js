const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.rating,
    req.body.imageURL);
  product.save();
  res.redirect('/');
}

exports.postDeleteProduct = (req, res, next) => {
  const index = products.findIndex(product => product.identifier === req.body.product_id);
  if (index < 0) {
    console.log('product not found');
    res.redirect('/?error=' + encodeURIComponent('UserNotFound'));
    return res.end();
  }

  products.splice(index, 1);
  res.redirect('/');
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Shop',
      path: '/admin/products'
    });
  });
}