const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const geoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    imageURL: {
        type: String,
        required: false
    }
});

geoSchema.statics.createGeo = async function(name, caption, imageURL) {
    var geo = new this();
    geo.name = name;
    geo.caption = caption;
    geo.imageURL = imageURL;
    await geo.save();
}

geoSchema.statics.createDefaultsIfNeeded = async function() {
    const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    await this.createGeo('Mountains', 'Lofty and Grand', '/images/geo-mountains.jpg');
    await this.createGeo('Desert', 'Bring Your Water', '/images/geo-desert.jpg');
    await this.createGeo('Plains', 'Flat as Kansas', '/images/geo-plains.jpg');
    await this.createGeo('Lakes', 'Great and Small but Salt-free', '/images/geo-lake.jpg');
    await this.createGeo('Ocean', 'Set Sail!', '/images/geo-ocean.jpg');
    await this.createGeo('City', 'Keep Your Friends Close... and your Neighbors Closer!', '/images/geo-city.jpg');
    await this.createGeo('Farms', 'Hard Work Builds Character(s)', '/images/geo-farm.jpg');
    await this.createGeo('Small Town', 'Everyone Knows Everyone', '/images/geo-town.jpg');
    await this.createGeo('Space Station', 'I Hope There\'s Gravity', '/images/geo-spacestation.jpg');
    await this.createGeo('Space Ship', 'Have Space Suit, Will Travel', '/images/geo-spaceship.jpg');

}

module.exports = mongoose.model('Geography', geoSchema);