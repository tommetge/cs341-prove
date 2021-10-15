const ejs = require('ejs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const mailgun = require('nodemailer-mailgun-transport');

const User = require('../models/user');

const defaultSenderAddress = 'noreply@mail.flyingpapersoftware.com';
var defaultURL = 'http://cs341-prove.herokuapp.com';
if (process.env.NODE_ENV === 'development') {
  defaultURL = 'http://localhost:3000';
}
const unsubscribeURL = defaultURL + '/unsubscribe';

const welcomeTemplate = './views/mail/welcome.ejs';
const resetPasswordTemplate = './views/mail/reset_password.ejs';

// I wasn't happy with Sendgrid (they suspended my account immediately after
// signing up) so I looked at other options. Hence the reason for multiple
// transport options.

// NOTE: Environment variables MUST BE SET for functional transports.
const sendgridTransport = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: process.env.SENDGRID_KEY
  }
}));

const mailgunTransport = nodemailer.createTransport(mailgun({
  auth: {
    api_key: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}));

const defaultTransport = mailgunTransport;
exports.transport = defaultTransport;

function sendMail(user, subject, html) {
  return defaultTransport.sendMail({
    from: defaultSenderAddress,
    to: user.email,
    subject: subject,
    html: html
  });
}

exports.sendResetPassword = async function(user) {
  const resetURL = defaultURL + '/new-password/' + user.resetToken;

  const html = await ejs.renderFile(resetPasswordTemplate, {
    user: user,
    url: resetURL,
    unsubscribe_url: unsubscribeURL
  });

  return sendMail(user, 'Reset Password', html);
}

exports.sendWelcome = async function(user) {
  const html = await ejs.renderFile(welcomeTemplate, {
    user: user,
    url: defaultURL,
    unsubscribe_url: unsubscribeURL
  });

  return sendMail(user, 'Welcome to CS341-Prove!', html);
}
