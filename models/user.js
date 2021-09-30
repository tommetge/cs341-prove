const mongodb = require('mongodb');

const Cart = require('./cart');
const getDB = require('../util/database').getDB;

module.exports = class User {
	constructor(username, email, id, cart_id) {
		this.username = username;
		this.email = email;
		this._id = id;
		this.cart_id = cart_id;
	}

	async cart() {
		var cart;
		if (this.cart_id) {
			cart = await Cart.findById(this.cart_id);
			if (cart) {
				return cart;
			}
		}

		cart = new Cart();
		await cart.save();
		this.cart_id = cart._id;
		await this.save();

		return cart;
	}

	async save() {
		return await User.save(this);
	}

	static fromMongo(mongoRep) {
		if (!mongoRep) {
			return null;
		}
		return new User(mongoRep.username, mongoRep.email, mongoRep._id, mongoRep.cart_id)
	}

	static collection() {
		return getDB().collection('users');
	}

	static async save(user) {
		if (user._id) {
			return await User.collection().replaceOne({ _id: user._id }, user);
	    }

	    const result = await User.collection().insertOne(user);
	    user._id = result.insertedId;

	    return result;
	}

	static async fetchAll() {
		const users = await User.collection().find().toArray();
		return users.map(user => { return User.fromMongo(user) });
	}

	static async findById(id) {
		const user = await User.collection().find({ _id: new mongodb.ObjectId(id) }).next();
		return User.fromMongo(user);
	}

	static async findAdmin() {
		const user = await User.collection().find({ username: 'tom', email: 'tom@metge.us' }).next();
		return User.fromMongo(user);
	}
}