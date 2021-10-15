const path = require('path');
const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
    check('email', 'Please enter a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter a valid password with at least 5 characters')
        .isLength({ min: 5 }),
    authController.postLogin);

router.get('/logout', authController.getLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
    check('email', 'Please enter a valid email')
        .isEmail()
        .custom(async email => {
            const user = await User.findOne({ email: email });
            if (user) {
                throw new Error('A user with this email already exists. Please login or choose a different address.');
            }
            return true;
        })
        .normalizeEmail(),
    body('password', 'Please enter a valid password with at least 5 characters')
        .isLength({ min: 5 }),
    body('confirmPassword', 'Passwords do not match')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }),
    authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset',
    check('email', 'Please enter a valid email')
        .isEmail()
        .custom(async email => {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('No account found with that email');
            }
            return true;
        })
        .normalizeEmail(),
    authController.postReset);

router.get('/new-password/:token', authController.getNewPassword);

router.post('/new-password',
    body('password', 'Please enter a valid password with at least 5 characters')
        .isLength({ min: 5 }),
    body('confirmPassword', 'Passwords do not match')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }),
    authController.postNewPassword);

module.exports = router;
