const mongodb = require('mongodb');

const getDB = require('../util/database').getDB;

module.exports = class Cart {
	constructor(products, totalPrice, user_id, id) {
		this.products = new Map();
		if (products) {
			this.products = new Map(products);
		}
		this.totalPrice = totalPrice ? totalPrice : 0;
		this.user_id = user_id;
		this._id = id;
	}

	async save() {
		if (this._id) {
		    const result = await Cart.collection().replaceOne({ _id: this._id }, this.mongoRep());
		    return result;
	    }

	    const result = await Cart.collection().insertOne(this.mongoRep());
	    this._id = result.insertedId;
	    return result;
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

	async reset() {
		if (this.products.length == 0) {
			return;
		}

		this.products = new Map();
		this.totalPrice = 0;
		return await this.save();
	}

	mongoRep() {
		return {
			products: [...this.products],
			totalPrice: this.totalPrice,
			user_id: this.user_id,
			_id: this._id
		}
	}

	static fromMongo(mongoRep) {
		if (mongoRep == null) {
			return null;
		}
		return new Cart(mongoRep.products, mongoRep.totalPrice, mongoRep.user_id, mongoRep._id);
	}

	static collection() {
		return getDB().collection('carts');
	}

	static async fetchAll() {
		const carts = await Cart.collection().find().toArray();
		return carts.map(cart => Cart.fromMongo(cart));
	}

	static async findByUserId(id) {
		if (typeof(id) === 'string') {
			id = new mongodb.ObjectId(id);
		}

		const cart = await Cart.collection().find({ user_id: id }).next();
		return Cart.fromMongo(cart);
	}

	static async deleteById(id) {
		if (typeof(id) === 'string') {
			id = new mongodb.ObjectId(id);
		}

		return await Cart.collection().deleteOne({ _id: id });
	}
}
