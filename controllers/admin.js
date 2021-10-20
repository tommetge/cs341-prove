require('../util/string');
const Role = require('../models/role');
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

// Helpers

async function findOneOrCreate(klass, id) {
  if (id === 'new') {
    return new klass();
  }

  return await klass.findOne({ _id: id });
}

async function renderGetItems(req, res, next, klass, item_type, name) {
  const items = await klass.find();
  res.render('admin/items', {
    pageTitle: 'Story ' + name.capitalize(),
    path: '/admin/' + item_type,
    items: items,
    item_type: item_type,
    name: name
  });
}

async function renderGetItem(req, res, next, klass, item_type) {
  const item = await findOneOrCreate(klass, req.params[item_type + '_id']);
  res.render('admin/edit-item', {
    pageTitle: 'Edit Story Type',
    path: '/admin/' + item_type,
    item: item,
    item_type: item_type
  });
}

async function handlePostItem(req, res, next, klass, item_type) {
  const item = await findOneOrCreate(klass, req.params[item_type + '_id']);
  if (!item) {
    console.log('Edit failed: could not find item!');
    return res.redirect('/admin/' + item_type);
  }

  item.name = req.body.name;
  item.caption = req.body.caption;
  item.description = req.body.description;
  item.imageURL = req.body.imageURL;
  await item.save();

  return res.redirect('/admin/' + item_type);
}

// Route-specific handlers

// Note: This is enabled for testing, allowing the user to switch
// roles with a button.
exports.getAdminify = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    req.flash('error', 'No user, cannot adminify!');
    res.redirect('/');
  }

  var nextRole;
  if (user.role.name == 'Admin') {
    nextRole = await Role.defaultRole();
  } else {
    nextRole = await Role.adminRole();
  }

  user.role = nextRole._id;
  await user.save();

  req.flash('info', 'User role changed to ' + nextRole.name + ', <a href="/admin/adminify">change back</a>');
  res.redirect('/');
}

exports.getTypes = async (req, res, next) => {
  return renderGetItems(req, res, next, StoryType, 'type', 'types');
}

exports.getType = async (req, res, next) => {
  return renderGetItem(req, res, next, StoryType, 'type');
}

exports.postType = async (req, res, next) => {
  return handlePostItem(req, res, next, StoryType, 'type');
}

exports.getGenres = async (req, res, next) => {
  return renderGetItems(req, res, next, Genre, 'genre', 'genres');
}

exports.getGenre = async (req, res, next) => {
  return renderGetItem(req, res, next, Genre, 'genre');
}

exports.postGenre = async (req, res, next) => {
  return handlePostItem(req, res, next, Genre, 'genre');
}

exports.getPeriods = async (req, res, next) => {
  return renderGetItems(req, res, next, Period, 'period', 'periods');
}

exports.getPeriod = async (req, res, next) => {
  return renderGetItem(req, res, next, Period, 'period');
}

exports.postPeriod = async (req, res, next) => {
  return handlePostItem(req, res, next, Period, 'period');
}

exports.getGeos = async (req, res, next) => {
  return renderGetItems(req, res, next, Geography, 'geo', 'geos');
}

exports.getGeo = async (req, res, next) => {
  return renderGetItem(req, res, next, Geography, 'geo');
}

exports.postGeo = async (req, res, next) => {
  return handlePostItem(req, res, next, Geography, 'geo');
}

exports.getFeatures = async (req, res, next) => {
  return renderGetItems(req, res, next, Talent, 'feature', 'features');
}

exports.getFeature = async (req, res, next) => {
  return renderGetItem(req, res, next, Talent, 'feature');
}

exports.postFeature = async (req, res, next) => {
  return handlePostItem(req, res, next, Talent, 'feature');
}

exports.getEvents = async (req, res, next) => {
  return renderGetItems(req, res, next, Event, 'event', 'events');
}

exports.getEvent = async (req, res, next) => {
  return renderGetItem(req, res, next, Event, 'event');
}

exports.postEvent = async (req, res, next) => {
  return handlePostItem(req, res, next, Event, 'event');
}
