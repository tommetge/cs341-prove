const Product = require('../models/product');
const Role = require('../models/role');

exports.getAdminify = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    req.flash('error', 'No user, cannot adminify!');
    res.redirect('/');
  }

  var nextRole;
  if (user.role.name == 'Admin') {
    nextRole = await Role.defaultRole();
  } else {
    nextRole = await Role.adminRole();
  }

  user.role = nextRole._id;
  await user.save();

  req.flash('info', 'User role changed to ' + nextRole.name + ', <a href="/admin/adminify">change back</a>');
  res.redirect('/');
}

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