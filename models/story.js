const mongoose = require('mongoose');

const Character = require('./character');
const Event = require('./event');

const Schema = mongoose.Schema;

const EventMultiplier = 1.5;

const storySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: Schema.Types.ObjectId,
        ref: 'StoryState',
        required: true
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'StoryType',
        required: false
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: false
    },
    period: {
        type: Schema.Types.ObjectId,
        ref: 'Period',
        required: false
    },
    geos: [{
        type: Schema.Types.ObjectId,
        ref: 'Geography',
        required: false
    }],
    talents: [{
        type: Schema.Types.ObjectId,
        ref: 'Talent',
        required: false
    }],
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: false
    }]
});

storySchema.methods.price = async function() {
    // Based on complexity: character prices * number of events
    const characters = await Character.find({ story_id: this._id });
    var characterTotal = 0;
    for (var character of characters) {
        const characterPrice = await character.price();
        characterTotal = characterTotal + characterPrice;
    }

    const events = await Event.find({ story_id: this._id });

    return characterTotal * events.length * EventMultiplier;
}

module.exports = mongoose.model('Story', storySchema);