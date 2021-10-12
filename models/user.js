const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchemaSaltSize = 12;

const userSchema = new Schema({
  name: {
  	type: String,
  	required: true
  },
  email: {
  	type: String,
  	required: true
  },
  passwordHash: {
    type: String,
    required: true
  }
});

userSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, UserSchemaSaltSize);
}

module.exports = mongoose.model('User', userSchema);
