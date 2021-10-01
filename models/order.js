const mongodb = require('mongodb');

const getDB = require('../util/database').getDB;

module.exports = class Order {
  constructor(products, total, user_id, id) {
    this.products = new Map();
    if (products) {
      this.products = new Map(products);
    }
    this.total = total ? total : 0;
    this.user_id = user_id;
    this._id = id;
  }

  async save() {
    if (this._id) {
      const result = await Order.collection().replaceOne({ _id: this._id }, this.mongoRep());
      this._id = result.insertedId;
      return result;
    }

    const result = await Order.collection().insertOne(this.mongoRep());
    this._id = result.insertedId;
    return result;
  }

  mongoRep() {
    return {
      products: [...this.products],
      total: this.total,
      user_id: this.user_id,
      _id: this._id
    }
  }

  static fromMongo(mongoRep) {
    return new Order(mongoRep.products, mongoRep.total, mongoRep.user_id, mongoRep._id);
  }

  static collection() {
    return getDB().collection('orders');
  }

  static orderFromCart(cart) {
    return new Order([...cart.products], cart.totalPrice, cart.user_id);
  }

  static async findById(id) {
    if (typeof(id) === 'string') {
      id = new mongodb.ObjectId(id);
    }

    console.log('finding order matching ' + id);
    const order = await Order.collection().find({ _id: id }).next();
    console.log('found order: ' + order);
    return Order.fromMongo(order);
  }

  static async findByUserId(user_id) {
    if (typeof(user_id) === 'string') {
      user_id = new mongodb.ObjectId(id);
    }

    const orders = await Order.collection().find({ user_id: user_id }).toArray();
    return orders.map(order => { return Order.fromMongo(order); })
  }
}
