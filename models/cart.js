// const mongoose = require('mongoose');
// const mongodb = require('mongodb');

// const Product = require('./product');

// const Schema = mongoose.Schema;

// const cartSchema = new Schema({
// 	products: {
// 		type: Map,
// 		of: Number
// 	},
// 	user_id: {
// 		type: Schema.Types.ObjectId,
// 		ref: 'User',
// 		required: true
// 	}
// });

// cartSchema.methods.addProduct = async function(product) {
// 	if (!this.products) {
// 		this.products = new Map();
// 	}

// 	let qty = 0;
// 	if (this.products.has(product._id.toString())) {
// 		qty = this.products.get(product._id.toString());
// 	}
// 	this.products.set(product._id.toString(), qty + 1);
// 	this.totalPrice = this.totalPrice + product.price;

// 	return await this.save();
// }

// cartSchema.methods.removeProduct = async function(product) {
// 	if (!this.products.has(product._id.toString())) {
// 		return;
// 	}

// 	const qty = this.products.get(product._id.toString());
// 	if (qty == 1) {
// 		this.products.delete(product._id.toString());
// 	} else {
// 		this.products.set(product._id.toString(), qty - 1);
// 	}

// 	this.totalPrice = this.totalPrice - product.price;

// 	return await this.save();
// }

// cartSchema.methods.reset = async function() {
// 	this.products.clear();
// 	this.totalPrice = 0;

// 	return await this.save();
// }

// cartSchema.methods.totalPrice = async function() {
// 	const products = await Product.find({
// 		_id: { $in: Array.from(this.products.keys()).map(key => new mongodb.ObjectId(key)) }
// 	});

// 	let totalPrice = 0;
// 	for (product of products) {
// 		totalPrice = totalPrice + (product.price * this.products.get(product._id.toString()));
// 	}

// 	return totalPrice;
// }

// module.exports = mongoose.model('Cart', cartSchema);
