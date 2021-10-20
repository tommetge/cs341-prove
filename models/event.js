const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: false
    }
});

eventSchema.statics.createDefaultEvent = async function(name, caption, description, imageURL) {
    var event = new this();
    event.name = name;
    event.caption = caption;
    event.description = description;
    event.imageURL = imageURL;
    await event.save();
}

eventSchema.statics.createDefaultsIfNeeded = async function() {
    const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    this.createDefaultEvent(
        'Skirmish',
        'Skirmishing between friends is discouraged',
        'Like a battle but smaller.',
        '/images/event-skirmish.jpg'
    );

    this.createDefaultEvent(
        'Battle',
        'Part of the wider war',
        'Win, lose, or draw: a battle can set the stage for changes in the story.',
        '/images/event-battle.jpg'
    );

    this.createDefaultEvent(
        'Epic Battle',
        'Huge battle with high stakes',
        'Epic battles can decide major swings in the plot.',
        '/images/event-epicbattle.jpg'
    );

    this.createDefaultEvent(
        'Boss Battle',
        'Hero vs. Villain',
        'It comes down to this after all.',
        '/images/event-bossbattle.jpg'
    );

    this.createDefaultEvent(
        'Short Trek',
        'Toe out the door',
        'Take a walk. Or a drive.',
        '/images/event-shorttrek.jpg'
    );

    this.createDefaultEvent(
        'Long Trek',
        'Home is an afterthought',
        'Hope that your character doesn\'t get homesick!',
        '/images/event-longtrek.jpg'
    );

    this.createDefaultEvent(
        'Epic Trek',
        'Home is forgotten',
        'Think Aragorn and friends.',
        '/images/event-epictrek.jpg'
    );

    this.createDefaultEvent(
        'Chase',
        'Run away!',
        'Chase or be chased. On foot, in a car, on a horse; it doesn\'t matter.',
        '/images/event-chase.jpg'
    );

    this.createDefaultEvent(
        'Life Lesson Learned',
        'Growing up',
        'A mentor (or just life) can jump in and teach a hard-earned lesson.',
        '/images/event-lifelesson.jpg'
    );
}

module.exports = mongoose.model('Event', eventSchema);