const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ username: 'username' }, (username, password, done) => {
      console.log(username);
      User.findOne({username:username}).then(user => {
        if (!user) {
          console.log("User not found!");
          return done(null, false);
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.log(err);
          } else {
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function(username, done) {
    User.findUserByUsername({username: username}, function(err, user) {
      done(err, user);
    });
  });
};
