const dateFormat = require('../util/date');
const mongodb = require('mongodb');

const Story = require('../models/story');
const StoryState = require('../models/story_state');
const StoryType = require('../models/story_type');
const Character = require('../models/character');
const CharacterRole = require('../models/character_role');
const Event = require('../models/event');
const StoryEvent = require('../models/event');
const Genre = require('../models/genre');
const Geography = require('../models/geography');
const Period = require('../models/period');
const Talent = require('../models/talent');
const StoryCart = require('../models/story_cart');
const User = require('../models/user');

function objectIdsFromBody(body) {
  const objectIds = new Array();
  for (var key in body) {
    if (key.length == 24) {
      var objectId = new mongodb.ObjectId(key);
      if (objectId) {
        objectIds.push(objectId);
      }
    }
  }

  return objectIds;
}

exports.getIndex = async (req, res, next) => {
  res.render('story/index', {
    pageTitle: 'Create Your Own Adventure',
    path: '/'
  });
}

exports.getStory = async (req, res, next) => {
  res.redirect('/story/' + req.params.story_id + '/review');
}

exports.getListStories = async (req, res, next) => {
  const stories = await Story.find({ user_id: req.user._id });
  res.render('story/list', {
    pageTitle: 'My Stories',
    path: '/list',
    stories: stories
  });
}

exports.getAddStory = async (req, res, next) => {
  const storyTypes = await StoryType.find();
  const genres = await Genre.find();

  res.render('story/add-story', {
    pageTitle: 'Create a Story',
    path: '/add-story',
    story_types: storyTypes,
    genres: genres
  });
}

exports.postAddStory = async (req, res, next) => {
  if (!req.body.story_name) {
    console.log('Invalid story!');
    return res.redirect('/story');
  }

  const story = new Story();
  story.user_id = req.user._id;
  story.state = await StoryState.defaultState();
  story.name = req.body.story_name;

  await story.save();

  req.session.story_id = story._id;

  res.redirect('/story/' + story._id.toString() + '/type');
}

exports.getAddType = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const story_types = await StoryType.find();

  res.render('story/add-type', {
    pageTitle: 'Add Type',
    path: '/add-type',
    story: story, 
    story_types: story_types
  });
}

exports.postAddType = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  var story_type;
  if (req.params.type_id) {
    story_type = await StoryType.findOne({ _id: req.params.type_id });
  } else {
    const objectIds = objectIdsFromBody(req.body);
    story_type = await StoryType.findOne({ _id: {$in: objectIds}});
  }

  if (!story_type) {
    console.log('Invalid story!');
    return res.redirect('/story');
  }

  story.type = story_type;
  await story.save();

  res.redirect('/story/' + story._id.toString() + '/genre');
}

exports.getAddGenre = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const genres = await Genre.find();

  res.render('story/add-genre', {
    pageTitle: 'Add Genre',
    path: '/add-genre',
    story: story, 
    genres: genres
  });
}

exports.postAddGenre = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  var genre;
  if (req.params.genre_id) {
    genre = await Genre.findOne({ _id: req.params.genre_id });
  } else {
    const objectIds = objectIdsFromBody(req.body);
    genre = await Genre.findOne({ _id: {$in: objectIds}});
  }

  if (!genre) {
    console.log('Invalid story!');
    return res.redirect('/story');
  }

  story.genre = genre;
  await story.save();

  res.redirect('/story/' + story._id.toString() + '/characters');
}

exports.getAddCharacters = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const characters = await Character.find({ story_id: story._id }).populate('story_id').populate('role');
  const characterRoles = await CharacterRole.find();

  res.render('story/add-characters', {
    pageTitle: 'Add Characters',
    path: '/add-characters',
    story: story,
    characters: characters,
    character_roles: characterRoles
  });
}

exports.postAddCharacters = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const character = new Character();
  character.story_id = story._id;
  character.role = new mongodb.ObjectId(req.body.character_role);
  character.name = req.body.character_name;
  await character.save();

  res.redirect('/story/' + story._id.toString() + '/characters');
}

exports.getAddPeriod = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const periods = await Period.find();

  res.render('story/add-period', {
    pageTitle: 'Choose Time Period',
    path: '/add-period',
    story: story,
    periods: periods
  });
}

exports.postAddPeriod = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  var period;
  if (req.params.period_id) {
    period = await Period.findOne({ _id: req.params.period_id });
  } else {
    const objectIds = objectIdsFromBody(req.body);
    period = await Period.findOne({ _id: {$in: objectIds}});
  }

  story.period = period;
  await story.save();

  res.redirect('/story/' + story._id.toString() + '/geos');
}

exports.getAddGeos = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const geos = await Geography.find();

  res.render('story/add-geos', {
    pageTitle: 'Choose Geography',
    path: '/add-geos',
    story: story,
    geos: geos
  });
}

exports.postAddGeos = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const objectIds = objectIdsFromBody(req.body);
  const geos = await Geography.find({ _id: {$in: objectIds}});

  story.geos = geos;
  await story.save();

  res.redirect('/story/' + story._id.toString() + '/features');
}

exports.getAddFeatures = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const talents = await Talent.find();

  res.render('story/add-features', {
    pageTitle: 'Choose World Features',
    path: '/add-features',
    story: story,
    features: talents
  });
}

exports.postAddFeatures = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const objectIds = objectIdsFromBody(req.body);
  const talents = await Talent.find({ _id: {$in: objectIds}});

  story.talents = talents;
  await story.save();

  res.redirect('/story/' + story._id.toString() + '/events');
}

exports.getAddEvents = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const events = await Event.find();

  res.render('story/add-events', {
    pageTitle: 'Add Events',
    path: '/add-events',
    story: story,
    events: events
  });
}

exports.postAddEvents = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const objectIds = objectIdsFromBody(req.body);
  const events = await Event.find({ _id: { $in: objectIds }});

  story.events = events;

  await story.save();

  res.redirect('/story/' + story._id + '/review');
}

exports.getStoryReview = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id })
    .populate('geos').populate('talents').populate('events').populate('state').populate('type').populate('genre').populate('period');
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const characters = await Character.find({ story_id: story._id }).populate('role');

  res.render('story/review', {
    pageTitle: 'Review Story',
    path: '/review',
    story: story,
    characters: characters
  });
}

exports.getStoryOrder = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  req.story_cart.addStory(story);

  res.redirect('/story/checkout');
}

exports.getStoryCheckout = async (req, res, next) => {
  const stories = await req.story_cart.allStories();
  const price = await req.story_cart.totalPrice();
  const story_prices = {};
  const story_characters = {};
  const story_events = {};
  for (var story of stories) {
    story_prices[story._id] = await story.price();
    story_characters[story._id] = await Character.count({story_id: story._id});
    story_events[story._id] = story.events.length;
  }

  res.render('story/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout',
    cart: req.story_cart,
    stories: stories,
    story_prices: story_prices,
    story_characters: story_characters,
    story_events: story_events,
    price: price
  });
}

exports.getModifyStoryCart = async (req, res, next) => {
  const story = await Story.findOne({ _id: req.query.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  if (req.query.remove == '1') {
    await req.story_cart.removeStory(story);
    res.redirect('/story/checkout');
    return;
  }

  if (req.query.add == '1') {
    await req.story_cart.addStory(story);
    res.redirect('/story/checkout');
    return;
  }

  res.redirect('/story/checkout');
}

exports.getStoryOrders = async (req, res, next) => {
  const stories = await Story.find({ user_id: req.user._id });

  res.render('story/orders', {
    pageTitle: 'Orders',
    path: '/orders',
    stories: stories
  });
}
