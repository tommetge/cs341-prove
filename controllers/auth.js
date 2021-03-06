const User = require('../models/user');
const Role = require('../models/role');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const mailer = require('../util/mail');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login'
  });
}

exports.postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      validationErrors: errors.array().map(e => e.msg),
      oldBody: req.body
    });
  }

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
  });
}

exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      validationErrors: errors.array().map(e => e.msg),
      oldBody: req.body
    });
  }

  const defaultRole = await Role.defaultRole();

  user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.passwordHash = await User.hashPassword(req.body.password);
  user.role = defaultRole._id;
  await user.save();

  req.session.user_id = user._id;
  await req.session.save();

  req.flash('info', 'Signed up successfully!');

  mailer.sendWelcome(user);

  res.redirect('/');
}

exports.getReset = async (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset',
    path: '/reset'
  });
}

exports.postReset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/reset', {
      pageTitle: 'Reset',
      path: '/reset',
      validationErrors: errors.array().map(e => e.msg),
      oldBody: req.body
    });
  }

  const buffer = await crypto.randomBytes(32);
  const token = buffer.toString('hex');
  const user = await User.findOne({email: req.body.email});
  if (!user) {
    req.flash('error', 'No account found with that email');
    return res.redirect('/reset');
  }
  user.resetToken = token;
  user.resetExpiration = Date.now() + 3600000;
  await user.save();

  mailer.sendResetPassword(user);

  console.log('Reset link sent to ' + user.email + ', http://localhost:3000/new-password/' + token);

  req.flash('info', 'Instructions sent to your email');

  res.redirect('/reset');
}

exports.getNewPassword = async (req, res, next) => {
  const user = await User.findOne({ resetToken: req.params.token, resetExpiration: { $gt: Date.now() }});

  if (!user) {
    req.flash('error', 'Invalid token');
    return res.redirect('/reset');
  }

  res.render('auth/new-password', {
    pageTitle: 'New Password',
    path: '/new-password',
    user_id: user._id.toString(),
    token: req.params.token
  });
}

exports.postNewPassword = async (req, res, next) => {
  const user = await User.findOne({resetToken: req.body.token, resetExpiration: {$gt: Date.now()}});

  if (!user) {
    req.flash('error', 'Invalid token');
    return res.redirect('/reset');
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/new-password', {
      pageTitle: 'New Password',
      path: '/new-password',
      user_id: user._id,
      token: req.body.token,
      validationErrors: errors.array().map(e => e.msg)
    });
  }

  user.passwordHash = await User.hashPassword(req.body.password);
  user.resetToken = undefined;
  user.resetExpiration = undefined;
  await user.save();

  req.flash('info', 'Password reset. Please login');

  res.redirect('/login');
}
