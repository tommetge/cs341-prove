const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

roleSchema.statics.createDefaultRoles = async function() {
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
