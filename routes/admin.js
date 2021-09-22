const path = require('path');
const express = require('express');
const uuid = require('uuid');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  });
});

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
  products.push({
    identifier: uuid.v4(),
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    rating: req.body.rating,
    imageURL: req.body.imageURL
  });
  res.redirect('/');
});

// /admin/delete-product => POST
router.post('/delete-product', (req, res, next) => {
  const index = products.findIndex(product => product.identifier === req.body.product_id);
  if (index < 0) {
    console.log('product not found');
    res.redirect('/?error=' + encodeURIComponent('UserNotFound'));
    return res.end();
  }

  products.splice(index, 1);
  res.redirect('/');
});

exports.routes = router;
exports.products = products;
