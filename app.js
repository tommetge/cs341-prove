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
const Role = require('./models/role');
const CharacterRole = require('./models/character_role');
const StoryState = require('./models/story_state');
const StoryType = require('./models/story_type');
const Genre = require('./models/genre');
const Period = require('./models/period');
const Geography = require('./models/geography');
const Talent = require('./models/talent');
const Event = require('./models/event');
const StoryCart = require('./models/story_cart');

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
        let storyCart = await StoryCart.findOne({ user_id: req.session.user_id });
        if (!storyCart) {
            storyCart = new StoryCart({ user_id: req.session.user_id });
            await storyCart.save();
        }
        req.story_cart = storyCart;

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
const storyRoutes = require('./routes/story');
const authRoutes = require('./routes/auth')

app.use('/admin', adminRoutes);
// app.use(shopRoutes);
app.use(storyRoutes);
app.use(authRoutes);

app.get('/500', errorsController.get500);

app.use(errorsController.get404);

if (process.env.NODE_ENV === 'production') {
    app.use(errorsController.handle500);
}

async function setup() {
    await mongoose.connect(dbUtils.mongodbURI());
	console.log('Connected!');

    // Admin roles
    await Role.createDefaultsIfNeeded();

    // Story data
    await StoryState.createDefaultsIfNeeded();
    await StoryType.createDefaultsIfNeeded();
    await Genre.createDefaultsIfNeeded();
    await CharacterRole.createDefaultsIfNeeded();
    await Period.createDefaultsIfNeeded();
    await Geography.createDefaultsIfNeeded();
    await Talent.createDefaultsIfNeeded();
    await Event.createDefaultsIfNeeded();
}

setup().then(result => {
	app.listen(process.env.PORT ? process.env.PORT : 3000);
}).catch(err => {
	console.log(err);
});
