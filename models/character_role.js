const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const characterRoleSchema = new Schema({
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

characterRoleSchema.statics.createDefaultsIfNeeded = async function() {
    const existing = await this.find();
    if (existing.length > 0) {
        return;
    }

    var role = new this();
    role.name = 'Main';
    role.caption = 'Main Character';
    role.description = 'The primary mover in the story. If it happens, it happens to the main character.';
    await role.save();

    role = new this();
    role.name = 'Support';
    role.caption = 'Supporting Character';
    role.description = 'This could be the main character\'s best friend, significant other, or just another character in the story.';
    await role.save();

    role = new this();
    role.name = 'Mentor';
    role.caption = 'Mentor';
    role.description = 'The old wizard, grizzled soldier, oracle, guardian of lost knowledge, or just the kindly neighbor with a little extra wisdom to share.';
    await role.save();

    role = new this();
    role.name = 'RedShirt';
    role.caption = 'Red Shirt';
    role.description = 'Some characters are fated for a brief stroll in the story and a sudden, tragic end.';
    await role.save();

    role = new this();
    role.name = 'Villain';
    role.caption = 'Villain';
    role.description = 'There must be opposition in all things. The story moves as much around the villian as the protagonist.';
    await role.save();
}

characterRoleSchema.methods.price = function() {
    switch(this.name) {
        case "Main":
        case "Villain":
            return 3;
        case "RedShirt":
            return 2.5;
        default:
            return 1.5;
    }
}

module.exports = mongoose.model('CharacterRole', characterRoleSchema);