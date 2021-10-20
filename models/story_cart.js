const mongoose = require('mongoose');
const mongodb = require('mongodb');

const Story = require('./story');
const StoryState = require('./story_state');

const Schema = mongoose.Schema;

const storyCartSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stories: {
        type: Map,
        of: Number
    }
});

storyCartSchema.methods.allStories = async function() {
    const allStoryIds = Array.from(this.stories.keys());
    return await Story.find({ _id: { $in: allStoryIds } });
}

storyCartSchema.methods.storyFor = async function(story_id) {
    return await Story.findOne({ _id: new mongodb.ObjectId(story_id) });
}

storyCartSchema.methods.addStory = async function(story) {
    if (!this.stories) {
        this.stories = new Map();
    }

    let qty = 0;
    if (this.stories.has(story._id.toString())) {
        qty = this.stories.get(story._id.toString());
    }
    this.stories.set(story._id.toString(), qty + 1);
    this.totalPrice = this.totalPrice + story.price();

    return await this.save();
}

storyCartSchema.methods.removeStory = async function(story) {
    if (!this.stories.has(story._id.toString())) {
        return;
    }

    const qty = this.stories.get(story._id.toString());
    if (qty == 1) {
        this.stories.delete(story._id.toString());
    } else {
        this.stories.set(story._id.toString(), qty - 1);
    }

    this.totalPrice = this.totalPrice - story.price();

    return await this.save();
}

storyCartSchema.methods.reset = async function() {
    this.stories.clear();
    this.totalPrice = 0;

    return await this.save();
}

storyCartSchema.methods.totalPrice = async function() {
    const stories = await this.allStories();

    let totalPrice = 0;
    for (story of stories) {
        const story_price = await story.price();
        const story_qty = this.stories.get(story._id);
        totalPrice = totalPrice + (story_price * story_qty);
    }

    return totalPrice;
}

module.exports = mongoose.model('StoryCart', storyCartSchema);
