const mongoose = require('mongoose');

const CharacterRole = require('./character_role');

const Schema = mongoose.Schema;

const characterSchema = new Schema({
    story_id: {
        type: Schema.Types.ObjectId,
        ref: 'Story',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'CharacterRole',
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

characterSchema.methods.price = async function() {
    const role = await CharacterRole.findOne({ _id: this.role });
    return await role.price();
}

module.exports = mongoose.model('Character', characterSchema);