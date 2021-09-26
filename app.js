const bodyParser = require('body-parser');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const errorsController = require('./controllers/errors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Using express layouts - much cleaner than just the partials
app.use(expressLayouts);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', path.join(__dirname, 'views', 'layouts', 'main-layout'));
app.set('layout extractStyles', true);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404);

app.listen(process.env.PORT ? process.env.PORT : 3000);
