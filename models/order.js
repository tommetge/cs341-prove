const mongoose = require('mongoose');
const mongodb = require('mongodb');

const Product = require('./product');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: {
    type: Map,
    of: Number
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

orderSchema.methods.copyFromCart = function(cart) {
  this.products = cart.products;
  this.user_id = cart.user_id;
}

orderSchema.methods.totalPrice = async function() {
  const products = await Product.find({
    _id: { $in: Array.from(this.products.keys()).map(key => new mongodb.ObjectId(key)) }
  });

  let totalPrice = 0;
  for (product of products) {
    totalPrice = totalPrice + (product.price * this.products.get(product._id.toString()));
  }

  return totalPrice;
}

module.exports = mongoose.model('Order', orderSchema);
