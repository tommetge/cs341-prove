const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

roleSchema.statics.createDefaultsIfNeeded = async function() {
  const roles = await this.find();
  if (roles.length > 0) {
      return;
  }

  var role = new this();
  role.name = 'Default';
  await role.save();

  role = new this();
  role.name = "Admin";
  await role.save();
}

roleSchema.statics.adminRole = async function() {
  return this.findOne({ name: "Admin" });
}

roleSchema.statics.defaultRole = async function() {
  return this.findOne({ name: "Default" });
}

module.exports = mongoose.model('Role', roleSchema);
