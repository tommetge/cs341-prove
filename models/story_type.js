const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storyTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    example_author: {
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
        required: true
    }
});

storyTypeSchema.statics.createDefaultsIfNeeded = async function() {
  const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    var story_type = new this();
    story_type.name = 'Disney';
    story_type.example_author = 'Walt Disney';
    story_type.caption = 'Happily Ever After';
    story_type.description = 'The best stories end happily ever after, even if the journey is a little bumpy along the way.';
    story_type.imageURL = '/images/Disney.jpg';
    await story_type.save();

    story_type = new this();
    story_type.name = 'Tragic';
    story_type.example_author = 'Shakespeare';
    story_type.caption = 'Pull Those Heartstrings';
    story_type.description = 'Sometimes, you just need a few tears to bring the story all the way home.';
    story_type.imageURL = '/images/Shakespeare.jpg';
    await story_type.save();

    story_type = new this();
    story_type.name = 'Horror';
    story_type.example_author = 'R.L. Stine';
    story_type.caption = 'Cower in Fear';
    story_type.description = 'Run as fast as you can. It won\'t help you survive but it will make the story more interesting!';
    story_type.imageURL = '/images/FearStreet.jpg';
    await story_type.save();

    story_type = new this();
    story_type.name = 'Epic';
    story_type.example_author = 'Tolkein';
    story_type.caption = 'Imagination Without Limit';
    story_type.description = 'The world of the story is so much bigger than the world outside your house.';
    story_type.imageURL = '/images/Tolkein.jpg';
    await story_type.save();
}

module.exports = mongoose.model('StoryType', storyTypeSchema);