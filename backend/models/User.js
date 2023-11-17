const mongoose = require('mongoose');
const {Schema} = mongoose;

// this UserSchema name should be userSchema
const UserSchema = new Schema({
  user_name: String,
  email: {type:String, unique:true},
  password: String,
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;