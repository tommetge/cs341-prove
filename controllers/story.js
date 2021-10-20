require('../util/string');
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

// Helpers

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

// Most data types are similar enough that there are only 4 common
// handlers. The route-specific handlers defer to these.

// Render a page to select a single item from a list
async function renderAddItem(req, res, next, klass, name, subtitle) {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const items = await klass.find();

  res.render('story/add-item', {
    pageTitle: 'Add ' + name.capitalize(),
    path: '/add-' + name,
    link_prefix: 'story',
    direct_link: true,
    back_link: req.query.ref,
    item_type: name,
    items: items,
    subtitle: subtitle,
    story: story
  });
}

// Renders a page to select multiple items from a list
async function renderAddItems(req, res, next, klass, property_name, name, subtitle) {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const items = await klass.find();
  const selected = story[property_name].map(geo => { return geo.toString() });

  res.render('story/add-items', {
    pageTitle: 'Choose ' + name.capitalize(),
    path: '/add-' + name,
    link_prefix: 'story',
    back_link: req.query.ref,
    item_type: name,
    items: items,
    story: story,
    selected: selected,
    subtitle: subtitle
  });
}

// Handles saving a single item (rendered via single selection)
async function handlePostItem(req, res, next, klass, property_name, name, next_dest) {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  var item;
  if (req.params[name + '_id']) {
    item = await klass.findOne({ _id: req.params[name + '_id'] });
  } else {
    const objectIds = objectIdsFromBody(req.body);
    item = await klass.findOne({ _id: {$in: objectIds}});
  }

  if (!item) {
    console.log('Invalid item!');
    return res.redirect('/story' + story._id);
  }

  story[property_name] = item._id;
  await story.save();

  if (req.query.ref) {
    return res.redirect(req.query.ref);
  }

  res.redirect('/story/' + story._id.toString() + '/' + next_dest);
}

// Handles saving multiple items (rendered via multiple selection)
async function handlePostItems(req, res, next, klass, property_name, name, next_dest) {
  const story = await Story.findOne({ _id: req.params.story_id });
  if (!story) {
    console.log('Story not found!');
    return res.redirect('/story');
  }

  const objectIds = objectIdsFromBody(req.body);
  const items = await klass.find({ _id: {$in: objectIds}});

  story[property_name] = items;
  await story.save();

  if (req.query.ref) {
    return res.redirect(req.query.ref);
  }

  res.redirect('/story/' + story._id.toString() + '/' + next_dest);
}

// Route-specific handlers

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
  return renderAddItem(req, res, next, StoryType, 'type', 'Select the kind of story you want to write');
}

exports.postAddType = async (req, res, next) => {
  return handlePostItem(req, res, next, StoryType, 'type', 'type', 'genre');
}

exports.getAddGenre = async (req, res, next) => {
  return renderAddItem(req, res, next, Genre, 'genre', 'Select your story\'s genre');
}

exports.postAddGenre = async (req, res, next) => {
  return handlePostItem(req, res, next, Genre, 'genre', 'genre', 'characters');
}

// Characters are unique - they have to be handled explicitly
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
  return renderAddItem(req, res, next, Period, 'period', 'Select your story\'s time period');
}

exports.postAddPeriod = async (req, res, next) => {
  return handlePostItem(req, res, next, Period, 'period', 'period', 'geos');
}

exports.getAddGeos = async (req, res, next) => {
  return renderAddItems(req, res, next, Geography, 'geos', 'geos', 'Select the geographies to include in your story');
}

exports.postAddGeos = async (req, res, next) => {
  return handlePostItems(req, res, next, Geography, 'geos', 'geos', 'features');
}

exports.getAddFeatures = async (req, res, next) => {
  return renderAddItems(req, res, next, Talent, 'talents', 'features', 'Select any special features of your story\'s world');
}

exports.postAddFeatures = async (req, res, next) => {
  return handlePostItems(req, res, next, Talent, 'talents', 'talents', 'events');
}

exports.getAddEvents = async (req, res, next) => {
  return renderAddItems(req, res, next, Event, 'events', 'events', 'Choose your story\'s major events');
}

exports.postAddEvents = async (req, res, next) => {
  return handlePostItems(req, res, next, Event, 'events', 'events', 'review');
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
