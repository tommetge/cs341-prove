const fs = require('fs');
const path = require('path');

const cartsPath = path.join(path.dirname(process.mainModule.filename), 'data', 'carts.json');

module.exports = class Cart {
	static readCart = cb => {
		fs.readFile(cartsPath, (err, fileContent) => {
			let cart = { products: new Map(), totalPrice: 0 };
			if (!err) {
				const storedCart = JSON.parse(fileContent);
				cart = {
					products: new Map(Object.entries(storedCart.products)),
					totalPrice: storedCart.totalPrice
				};
			}

			cb(cart);
		});
	}

	static saveCart(cart, cb) {
		const preJSON = {
			products: Object.fromEntries(cart.products),
			totalPrice: cart.totalPrice
		}
		fs.writeFile(cartsPath, JSON.stringify(preJSON), err => {
			cb(err);
		});
	}

	static addProduct(id, price, cb) {
		Cart.readCart(cart => {
			let product = cart.products.get(id);
			if (!product) {
				product = {
					qty: 0,
					price: price
				}
			}

			product.qty = product.qty + 1;
			cart.products.set(id, product);
			cart.totalPrice = cart.totalPrice + +price;

			Cart.saveCart(cart, err => {
				console.log(err);
				cb(err);
			});
		});
	}

	static deleteProduct(id, cb) {
		console.log("removing product " + id);
		Cart.readCart(cart => {
			if (cart.products.has(id)) {
				const product = cart.products.get(id)
				const priceDeduction = product.price * product.qty;
				cart.products.delete(id);
				cart.totalPrice = cart.totalPrice - priceDeduction;
				Cart.saveCart(cart, err => {
					console.log(err);
					cb(err);
				});
			}
			cb(null);
		});
	}

	static getCart(cb) {
		Cart.readCart(cart => {
			cb(cart);
		});
	}
}