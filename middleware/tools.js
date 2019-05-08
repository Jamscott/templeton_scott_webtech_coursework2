const User = require('../models/user.model');
var jwt = require('jsonwebtoken');

var doesUserExist = (username) => {
    User.findOne({ username: username }).then((err, result) => {
        if (err) {
            console.log(err);
        }
        if (!result) {
            return false;
        }
        return true;
    });
}

module.exports = {
    doesUserExist: doesUserExist,
}
