const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const talentSchema = new Schema({
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

talentSchema.statics.createDefaultTalent = async function(name, caption, description, imageURL) {
    var talent = new this();
    talent.name = name;
    talent.caption = caption;
    talent.description = description;
    talent.imageURL = imageURL;
    await talent.save();
}

talentSchema.statics.createDefaultsIfNeeded = async function() {
    const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    await this.createDefaultTalent(
        'Default', 'Nothing to See Here',
        'Nothing strikes you as unusual or exception about this world.',
        '/images/talent-default.jpg');
    await this.createDefaultTalent(
        'Magic', 'Anything is Possible',
        'Magic is alive in the world - for better or worse!',
        '/images/talent-magic.jpg');
    await this.createDefaultTalent(
        'High Tech', 'Not Magic, I Promise',
        'Sufficiently advanced technology is (purportedly) indistinguishable from magic. It\'s still tech, though!',
        '/images/talent-hightech.jpg');
}

module.exports = mongoose.model('Talent', talentSchema);