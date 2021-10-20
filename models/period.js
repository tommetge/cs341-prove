const mongoose = require('mongoose');

const Genre = require('./genre');

const Schema = mongoose.Schema;

const periodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    genre: {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
        required: true
    },
    imageURL: {
        type: String,
        required: false
    }
});

periodSchema.statics.createDefaultPeriod = async function(name, genre, imageURL) {
    var period = new this();
    period.name = name;
    period.genre = genre._id;
    period.imageURL = imageURL;
    period.save();
}

periodSchema.statics.createDefaultsIfNeeded = async function() {
    const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    const genre_fantasy = await Genre.findOne({ name: 'Fantasy' });
    const genre_scifi = await Genre.findOne({ name: 'Science Fiction' });
    const genre_historical = await Genre.findOne({ name: 'Historical' });
    const genre_modern = await Genre.findOne({ name: 'Modern' });

    await this.createDefaultPeriod('Primitive', genre_fantasy, '/images/period-primitive.jpg');
    await this.createDefaultPeriod('Middle Earth', genre_fantasy, '/images/period-middleearth.jpg');
    await this.createDefaultPeriod('Primitive', genre_historical, '/images/period-primitive.jpg');
    await this.createDefaultPeriod('Medieval', genre_historical, '/images/period-medieval.jpg');
    await this.createDefaultPeriod('Western', genre_historical, '/images/period-western.jpg');
    await this.createDefaultPeriod('World Wars', genre_historical, '/images/period-ww.jpg');
    await this.createDefaultPeriod('Industrial', genre_historical, '/images/period-industrial.jpg');
    await this.createDefaultPeriod('Near Future', genre_scifi, '/images/period-nearfuture.jpg');
    await this.createDefaultPeriod('Far Future', genre_scifi, '/images/period-farfuture.jpg');
    await this.createDefaultPeriod('Today', genre_modern, '/images/period-today.jpg');
}

module.exports = mongoose.model('Period', periodSchema);