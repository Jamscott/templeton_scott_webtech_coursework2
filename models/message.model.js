var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    conversation: String,
    sender: String,
    time: {
        type: Date,
        default: Date.now,
    },
    content: String
}, { versionKey: false });

module.exports = mongoose.model('Message', MessageSchema);
