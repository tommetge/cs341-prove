const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const genreSchema = new Schema({
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
        required: true
    }
});

genreSchema.statics.createDefaultsIfNeeded = async function() {
    const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    var genre = new this();
    genre.name = 'Fantasy';
    genre.caption = 'Reimagining the World';
    genre.description = 'Magic, swords, sorcery, and everything in-between.';
    genre.imageURL = '/images/genre-fantasy.jpg';
    await genre.save();

    genre = new this();
    genre.name = 'Science Fiction';
    genre.caption = 'Vision of the Future';
    genre.description = 'Advanced technology that can be indistinguishable from magic!';
    genre.imageURL = '/images/genre-sciencefiction.jpg';
    await genre.save();

    genre = new this();
    genre.name = 'Historical';
    genre.caption = 'Back in Time';
    genre.description = 'Put your own stamp on history.';
    genre.imageURL = '/images/genre-historical.jpg';
    await genre.save();

    genre = new this();
    genre.name = 'Modern';
    genre.caption = 'It Could Happen';
    genre.description = 'Stories told in today\'s world.';
    genre.imageURL = '/images/genre-modern.jpg';
    await genre.save();
}

module.exports = mongoose.model('Genre', genreSchema);