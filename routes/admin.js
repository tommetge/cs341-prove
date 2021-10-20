const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');
const { auth, permit } = require('../middleware/auth');

const router = express.Router();

router.get('/adminify', adminController.getAdminify);

// Types
router.get('/type', adminController.getTypes);

router.post('/type', adminController.postType);

router.get('/type/:type_id', adminController.getType);

router.post('/type/:type_id', adminController.postType);

// Genres
router.get('/genre', adminController.getGenres);

router.post('/genre', adminController.postGenre);

router.get('/genre/:genre_id', adminController.getGenre);

router.post('/genre/:genre_id', adminController.postGenre);

// Periods
router.get('/period', adminController.getPeriods);

router.post('/period', adminController.postPeriod);

router.get('/period/:period_id', adminController.getPeriod);

router.post('/period/:period_id', adminController.postPeriod);

// Geos
router.get('/geo', adminController.getGeos);

router.post('/geo', adminController.postGeo);

router.get('/geo/:geo_id', adminController.getGeo);

router.post('/geo/:geo_id', adminController.postGeo);

// Features
router.get('/feature', adminController.getFeatures);

router.post('/feature', adminController.postFeature);

router.get('/feature/:feature_id', adminController.getFeature);

router.post('/feature/:feature_id', adminController.postFeature);

// Events
router.get('/event', adminController.getEvents);

router.post('/event', adminController.postEvent);

router.get('/event/:event_id', adminController.getEvent);

router.post('/event/:event_id', adminController.postEvent);

module.exports = router;
