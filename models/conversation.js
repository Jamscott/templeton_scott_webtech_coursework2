var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var Schema = mongoose.Schema;
var Message = require('./message.model');
var User = require('./user.model');

var ConversationSchema = new Schema({
    name: String,
    admin: String,
    participants: [ String ]
}, { versionKey: false });

module.exports = mongoose.model('Conversation', ConversationSchema);

ConversationSchema.methods.addParticipant = function (username) {
    User.findOne({username: username}, user => {
        if (user) {
            this.participants.push(username);
            var addedMessage = new Message({
                sender: this.admin,
                content: "I added a new member to the chat room: " + username,
                conversation: this._id
            });
            addedMessage.save().catch(err => console.log(err));
            console.log(this.creator + " added " + username + " to conversation" + this.name);
        }
    });
};

ConversationSchema.methods.removeParticipant = function (username) {
    for (var i = 0; i < this.participants.size; i++) {
        if (this.participants[i] == username) {
            this.participants.splice(i, 1);
            var addedMessage = new Message({
                sender: this.admin,
                content: "I removed a member from the chat room: " + username,
                conversation: this._id
            });
            addedMessage.save().catch(err => console.log(err));
        }
    }
};

ConversationSchema.methods.isParticipant = function (username) {
    for (var i = 0; i < this.participants.size; i++) {
        if (this.participants[i] == username) {
            return true;
        }
    }
    return false;
};


ConversationSchema.methods.getMessages = function () {
    Message.find({ conversation: this._id }, (err, messages) => {
        if (err) throw err;
        return messages;
    })
};
