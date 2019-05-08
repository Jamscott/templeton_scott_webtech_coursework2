var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const path = require('path');

const User = require('../models/user.model');
const Tools = require('../middleware/tools');


router.get('/:username', (req, res) => {
  var username = req.params.username;

  User.findOne({ username:username }, (err, user) => {
    if (user) {
      res.json(user);
    } else {
      res.json({});
    }
  }).catch(err => console.log(err));
});

module.exports = router;
