const bodyParser = require('body-parser');
const csurf = require('csurf');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('express-async-errors');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);

const dbUtils = require('./util/database');
const errorsController = require('./controllers/errors');
const User = require('./models/user');
const Cart = require('./models/cart');
const Role = require('./models/role');

const sessionStore = new MongoSessionStore({
    uri: dbUtils.mongodbURI(),
    collection: 'sessions'
});

const csrfProtection = csurf();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({secret: 'secret', resave: false, saveUninitialized: false, store: sessionStore}));
app.use(csrfProtection);
app.use(flash());

// Using express layouts - much cleaner than just the partials
app.use(expressLayouts);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, 'views', 'layouts', 'main-layout'));
app.set('layout extractStyles', true);

app.use(async (req, res, next) => {
    if (req.session.user_id) {
        req.user = await User.findOne({ _id: req.session.user_id }).populate('role');
        let cart = await Cart.findOne({ user_id: req.session.user_id });
        if (!cart) {
            cart = new Cart({ user_id: req.session.user_id });
            await cart.save();
        }
        req.cart = cart;

        res.locals.user = req.user;
        res.locals.isLoggedIn = true;
    } else {
        res.locals.isLoggedIn = false;
    }

    res.locals.csrfToken = req.csrfToken();
    res.locals.flashError = req.flash('error');
    res.locals.flashErrors = req.flash('errors');
    res.locals.flashInfo = req.flash('info');

    next();
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorsController.get500);

app.use(errorsController.get404);

app.use(errorsController.handle500);

async function setup() {
    await mongoose.connect(dbUtils.mongodbURI());
	console.log('Connected!');

    const roles = await Role.find();
    if (roles.length == 0) {
        await Role.createDefaultRoles();
    }
}

setup().then(result => {
	app.listen(process.env.PORT ? process.env.PORT : 3000);
}).catch(err => {
	console.log(err);
});
