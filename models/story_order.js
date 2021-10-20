const mongoose = require('mongoose');
const mongodb = require('mongodb');

const formatDate = require('../util/date');

const Story = require('./story');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  stories: {
    type: Map,
    of: Number
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

orderSchema.methods.copyFromCart = function(cart) {
  this.stories = cart.stories;
  this.user_id = cart.user_id;
}

orderSchema.methods.totalPrice = async function() {
  const stories = await this.orderedStories();

  let totalPrice = 0;
  for (story of stories) {
    var storyPrice = await story.price();
    totalPrice = totalPrice + (storyPrice * this.stories.get(story._id.toString()));
  }

  return totalPrice;
}

orderSchema.methods.orderedStories = async function() {
  return Story.find({
    _id: { $in: Array.from(this.stories.keys()).map(key => new mongodb.ObjectId(key)) }
  });
}

orderSchema.methods.formattedDate = function() {
  return formatDate(this.created_at);
}

module.exports = mongoose.model('StoryOrder', orderSchema);
