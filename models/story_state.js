const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storyStateSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

storyStateSchema.statics.defaultState = async function() {
    return this.findOne({ name: 'Default' });
}

storyStateSchema.statics.createDefaultsIfNeeded = async function() {
  const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    var state = new this();
    state.name = 'Default';
    await state.save();

    state = new this();
    state.name = 'In Progress';
    await state.save();

    state = new this();
    state.name = 'Complete';
    await state.save();
}

module.exports = mongoose.model('StoryState', storyStateSchema);