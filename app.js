const bodyParser = require('body-parser');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
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
	req.user = await User.findAdmin();
	req.cart = await req.user.cart();
	next();
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

async function setup() {
	await mongoConnect();

	const admin = await User.findAdmin();
	if (!admin) {
		user = new User('tom', 'tom@metge.us');
		return await user.save();
	}

	return admin;
}

setup().then(result => {
	app.listen(process.env.PORT ? process.env.PORT : 3000);
}).catch(err => {
	console.log(err);
});
