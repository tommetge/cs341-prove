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
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.rating,
    req.body.imageURL);
    await Product.save(product);
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
  const product = Product.findById(productId);
  product.title = req.body.title;
  product.price = req.body.price;
  product.description = req.body.description;
  product.rating = req.body.rating;
  product.imageURL = req.body.imageURL;
  await Product.save(product);
  res.redirect('/admin/products');
}

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  await Product.deleteById(productId);
      // if (!product) {
      //   res.redirect('/?error=' + encodeURIComponent('ProductNotFound'));
      //   return res.end();
      // }

  res.redirect('/admin/products');
}

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Shop',
    path: '/admin/products'
  });
}