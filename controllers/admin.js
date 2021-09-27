const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    product: new Product(),
    editing: false,
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

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    res.render('admin/edit-product', {
      product: product,
      editing: true,
      pageTitle: 'Edit Product',
      path: '/admin/edit-product'
    });
  });
}

exports.postEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.rating = req.body.rating;
    product.imageURL = req.body.imageURL;
    product.save();
    res.redirect('/admin/products');
  });
}

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    if (!product) {
      res.redirect('/?error=' + encodeURIComponent('ProductNotFound'));
      return res.end();
    }

    product.delete();
    res.redirect('/admin/products');
  });
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