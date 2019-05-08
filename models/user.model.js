const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
   username: String,
   name: String,
   password: String,
   conversations: [ Number ]
},{ versionKey: false });

module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = (attemptedPassword, hash, callback) => {
  bcrypt.compare(attemptedPassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}


module.exports.findUserByUsername = (username, callback) => {
  User.findOne({username: username}, callback);
}
