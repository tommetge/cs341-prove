const mongodb = require('mongodb');

const getDB = require('../util/database').getDB;

module.exports = class Cart {
	constructor(products, totalPrice, id) {
		this.products = new Map();
		if (products) {
			this.products = new Map(products); /* new Map(Object.entries(products)); */
		}
		this.totalPrice = totalPrice ? totalPrice : 0;
		this._id = id;
	}

	async save() {
		return Cart.save(this);
	}

	async addProduct(id, price) {
		let product = this.products.get(id);
		if (!product) {
			product = {
				qty: 0,
				price: price
			}
		}

		product.qty = product.qty + 1;
		this.products.set(id, product);
		this.totalPrice = this.totalPrice + +price;

		return this.save();
	}

	async removeProduct(id) {
		if (!this.products.has(id)) {
			return;
		}

		const product = this.products.get(id);
		if (product.qty == 1) {
			return this.deleteProduct(id);
		}

		product.qty = product.qty - 1;
		this.totalPrice = this.totalPrice - product.price;

		return this.save();
	}

	async deleteProduct(id) {
		if (!this.products.has(id)) {
			return;
		}

		const product = this.products.get(id)
		const priceDeduction = product.price * product.qty;
		this.products.delete(id);
		this.totalPrice = this.totalPrice - priceDeduction;

		return this.save();
	}

	mongoRep() {
		return {
			products: [...this.products], /*Object.fromEntries(this.products), */
			totalPrice: this.totalPrice,
			_id: this._id
		}
	}

	static fromMongo(mongoRep) {
		if (mongoRep == null) {
			return null;
		}
		return new Cart(mongoRep.products, mongoRep.totalPrice, mongoRep._id);
	}

	static collection() {
		return getDB().collection('carts');
	}

	static async save(cart) {
		if (cart._id) {
		    const result = await Cart.collection().replaceOne({ _id: cart._id }, cart.mongoRep());
		    cart._id = result.insertedId;
		    return result;
	    }

	    const result = await Cart.collection().insertOne(cart.mongoRep());
	    cart._id = result.insertedId;
	    return result;
	}

	static async findById(id) {
		if (typeof(id) === 'string') {
			id = new mongodb.ObjectId(id);
		}

		const cart = await Cart.collection().find({ _id: id }).next();
		return Cart.fromMongo(cart);
	}

	static async fetchAll() {
		const carts = await Cart.collection().find().toArray();
		return carts.map(cart => Cart.fromMongo(cart));
	}

	static async deleteById(id) {
		if (typeof(id) === 'string') {
			id = new mongodb.ObjectId(id);
		}

		return await Cart.collection().deleteOne({ _id: id });
	}
}
