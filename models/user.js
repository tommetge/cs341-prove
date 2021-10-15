const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Role = require('./role');

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
  },
  role: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Role"
  },
  resetToken: {
    type: String
  },
  resetExpiration: {
    type: Date
  }
});

userSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, UserSchemaSaltSize);
}

userSchema.pre('save', async (doc, next) => {
  if (this.role == null) {
    const defaultRole = await Role.defaultRole();
    this.role = defaultRole._id;
  }
});

module.exports = mongoose.model('User', userSchema);
