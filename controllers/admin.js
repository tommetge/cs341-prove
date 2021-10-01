const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    product: new Product(),
    editing: false,
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
}

exports.postAddProduct = async (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    rating: req.body.rating,
    imageURL: req.body.imageURL
  });
  await product.save(product);
  res.redirect('/');
}

exports.getEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  res.render('admin/edit-product', {
    product: product,
    editing: true,
    pageTitle: 'Edit Product',
    path: '/admin/edit-product'
  });
}

exports.postEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  product.title = req.body.title;
  product.price = req.body.price;
  product.description = req.body.description;
  product.rating = req.body.rating;
  product.imageURL = req.body.imageURL;
  await product.save();
  res.redirect('/admin/products');
}

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  await Product.findByIdAndRemove(productId);
  res.redirect('/admin/products');
}

exports.getProducts = async (req, res, next) => {
  const products = await Product.find();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Shop',
    path: '/admin/products'
  });
}