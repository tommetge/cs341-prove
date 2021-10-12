const User = require('../models/user');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}));

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login'
  });
}

exports.postLogin = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }

  const matching = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!matching) {
    req.flash('error', 'Invalid email or password');
    return res.redirect('/login');
  }

  req.flash('info', 'Logged in!');
  req.session.user_id = user._id;
  await req.session.save();
  res.redirect('/');
}

exports.getLogout = async (req, res, next) => {
  await req.session.destroy();
  res.redirect('/login');
}

exports.getSignup = async (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup'
  })
}

exports.postSignup = async (req, res, next) => {
  var user = await User.findOne({ email: req.body.email });
  if (user != null) {
    req.flash('error', 'User exists - please login');
    return res.redirect('/login');
  }

  if (req.body.password != req.body.confirmPassword) {
    req.flash('error', 'Passwords do not match!');
    return res.redirect('/signup');
  }

  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.passwordHash = await User.hashPassword(req.body.password);
  await user.save();

  req.session.user_id = user._id;
  await req.session.save();

  req.flash('info', 'Signed up successfully!');

  transporter.sendMail({
    to: user.email,
    from: 'tom@accident-prone.com',
    subject: 'Welcome!',
    html: '<h1>Welcome to the CS341 Shop!!'
  });

  res.redirect('/');
}
