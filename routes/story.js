const express = require('express');

const storyController = require('../controllers/story');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', storyController.getIndex);

router.get('/story', storyController.getIndex);

router.get('/story/list', storyController.getListStories);

router.get('/story/orders', storyController.getStoryOrders);

router.get('/story/orders/:order_id', storyController.getStoryOrderById);

router.get('/story/add', storyController.getAddStory);

router.post('/story/add', storyController.postAddStory);

router.get('/story/:story_id/type', storyController.getAddType);

router.post('/story/:story_id/type', storyController.postAddType);

router.get('/story/:story_id/type/:type_id', storyController.postAddType);

router.get('/story/:story_id/genre', storyController.getAddGenre);

router.post('/story/:story_id/genre', storyController.postAddGenre);

router.get('/story/:story_id/genre/:genre_id', storyController.postAddGenre);

router.get('/story/:story_id/characters', storyController.getAddCharacters);

router.post('/story/:story_id/characters', storyController.postAddCharacters);

router.get('/story/:story_id/period', storyController.getAddPeriod);

router.post('/story/:story_id/period', storyController.postAddPeriod);

router.get('/story/:story_id/period/:period_id', storyController.postAddPeriod);

router.get('/story/:story_id/geos', storyController.getAddGeos);

router.post('/story/:story_id/geos', storyController.postAddGeos);

router.get('/story/:story_id/features', storyController.getAddFeatures);

router.post('/story/:story_id/features', storyController.postAddFeatures);

router.get('/story/:story_id/events', storyController.getAddEvents);

router.post('/story/:story_id/events', storyController.postAddEvents);

router.get('/story/:story_id/review', storyController.getStoryReview);

router.get('/story/:story_id/order', storyController.getStoryOrder);

router.get('/story/checkout', storyController.getStoryCheckout);

router.post('/story/checkout', storyController.postStoryCheckout);

router.get('/story/cart/modify', storyController.getModifyStoryCart);

router.get('/story/:story_id', storyController.getStory);

module.exports = router;
