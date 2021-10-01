const bodyParser = require('body-parser');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');

const errorsController = require('./controllers/errors');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const Cart = require('./models/cart');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Using express layouts - much cleaner than just the partials
app.use(expressLayouts);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, 'views', 'layouts', 'main-layout'));
app.set('layout extractStyles', true);

app.use(async (req, res, next) => {
	req.user = await User.findOne({ username: 'tom', email: 'tom@metge.us' });
	let cart = await Cart.findOne({ user_id: req.user._id });
	if (!cart) {
		cart = new Cart({ user_id: req.user._id });
		await cart.save();
	}
	req.cart = cart;
	next();
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

async function setup() {
	await mongoose.connect('mongodb://192.168.1.6/cs341-prove');
	console.log('Connected!');

	const admin = await User.findOne({ username: 'tom', email: 'tom@metge.us' });
	if (!admin) {
		user = new User({ username: 'tom', email: 'tom@metge.us' });
		return await user.save();
	}

	return admin;
}

setup().then(result => {
	app.listen(process.env.PORT ? process.env.PORT : 3000);
}).catch(err => {
	console.log(err);
});
