const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const path = require('path');
const publicPath = "/Users/scott/Desktop/WebCourseWork/public/";
const dialog = require('dialog');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/auth');
//Render Home Page
router.get('/', (req, res) => res.sendFile(path.join(publicPath+'/index.html')));

//Render register page
router.get('/signup', forwardAuthenticated, (req, res) => res.sendFile(path.join(publicPath+'/signup.html')));

//Render account page
router.get('/account', ensureAuthenticated, (req, res) => res.sendFile(path.join(publicPath+'/account.html')));

//Render login page
router.get('/login', (req, res) => res.sendFile(path.join(publicPath+'/login.html')));


//Register account post
router.post('/signup', (req, res) => {
  console.log(req.body);

  var username = req.body.username;
  var name = req.body.name;
  var password = req.body.password;

  if (!username) {
    dialog.info('Invalid Account information');
    return res.redirect('/signup');
  }

  if (!name) {
    dialog.info('Invalid Account information');
    return res.redirect('/signup');
  }

  if (!password) {
    dialog.info('Invalid Account information');
    return res.redirect('/signup');
  }


  User.findOne({username: username}).then(user => {
    if (user) {
      res.redirect('/signup');
      dialog.info('Invalid Account information');
      console.log("Account already exists with the name " + username);
    } else {

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          var newUser = new User({
            username: username,
            name: name,
            password: hash
          });

          newUser.save().then(result => {
            console.log(result);
            res.redirect('/login');
          }).catch(err => console.log(err));
        });
      });
    }
  }).catch(err => console.log(err));
});

router.post('/login', (req, res) => {
  console.log("Starting log in...");
  passport.authenticate('local', {
    successRedirect: '/account',
    failureRedirect: '/login',
  });
  /*

  var username = req.body.username;
  var password = req.body.password;

  console.log(req.body);

  User.findOne({username:username}).then(user => {
    if (user) {



      User.comparePassword(password, user.password, (err, isMatch) => {
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

      console.log("Pass correct!")


      return res.redirect('/account');
    } else {
      dialog.info("Invalid account information");
      return res.redirect('/login');
    }
  }).catch(err => console.log(err));

  */
});

router.post('/logout', (req, res) => {
  res.logout();
  res.redirect('/login');
});


module.exports = router;
