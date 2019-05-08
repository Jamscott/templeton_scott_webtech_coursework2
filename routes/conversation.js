const express = require('express');
const router = express.Router();
const console = require('console');
const path = require('path');
const dialog = require('dialog');

const tools = require('../middleware/tools');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation');

const publicPath = "/Users/scott/Desktop/WebCourseWork/public/";

//Render conversation
router.get('/:id', (req, res) => {
   var conversationName = req.params.id;
   Conversation.findOne({name: conversationName}, (err, conversation) => {
      if (!conversation) {
          res.redirect('/conversations');
      } else {
          if (!conversation.isParticipant(req.user.username)) {
              dialog.info("You are not part of this conversation!");
              res.redirect('/account');
          } else {
              res.sendFile(path.join(publicPath+'/conversation.html'));
          }
      }
   }).catch(err => console.log(err));
});

router.get('/messages/:id', (req, res) => {
   var conversationName = req.params.id;
   Conversation.findOne({name: conversationName}, (err, conversation) => {
      if (!conversation) {
          res.redirect('/account');
      } else {
          if (!conversation.isParticipant(req.user.username)) {
              dialog.info("You are not part of this conversation!");
              res.redirect('/account');
          } else {
              Message.findAll({conversation:conversationName}, (err, data) => {
                  res.json(data);
              });
          }
      }
   }).catch(err => console.log(err));
});

router.get('/create/:id', (req, res) => {
   var conversationName = req.params.id;
   Conversation.findOne({name: conversationName}, (err, conversation) => {
      if (conversation) {
          dialog.info("Already conversation with that name exists!")
          res.redirect('/account');
      } else {

        var username = req.user.username;

        var newConvo = new Conversation({
          name: conversationName,
          admin: username,
          participants: [username]
        });

        newConvo.save().then(result => {
          console.log(result);
          res.redirect('/conversations/' + conversationName);
        }).catch(err => console.log(err));
      }
   }).catch(err => console.log(err));
});

//Add new member to conversation
router.post('/member/remove/:id', (req, res) => {
    var conversationName = req.params.id;
    Conversation.findOne({name: conversationName}, (err, conversation) => {
        if (!conversation) {
            res.redirect('/conversations');
        } else {
            if (!conversation.isParticipant(req.user.username)) {
                res.redirect('/conversations');
                dialog.info("You are not a member of this conversation!")
            } else {
                var user = req.user;
                if (conversation.admin != user.username) {
                    dialog.info("Only the admin can remove members");
                } else {
                    var newUser = req.body.member;

                    if (!conversation.isParticipant(newUser)) {
                        res.redirect('/' + conversation.name);
                    } else {
                        conversation.removeParticipant(newUser);
                    }
                }
                res.redirect('/' + conversation.name);
            }
        }
    }).catch(err => console.log(err));
});


router.post('/member/add/:id', (req, res) => {
    var conversationName = req.params.id;
    Conversation.findOne({name: conversationName}, (err, conversation) => {
        if (!conversation) {
            res.redirect('/conversations');
        } else {
            if (!conversation.isParticipant(req.user.username)) {
                res.redirect('/conversations');
                console.log("You are not a member of this conversation!")
            } else {
                var user = req.user;
                if (conversation.admin != user.username) {
                    console.log("Only the admin can add members");
                } else {
                    var newUser = req.body.member;
                    if (conversation.isParticipant(newUser)) {
                        res.redirect('/' + conversation.name);
                    } else {
                        conversation.addParticipant(newUser);
                    }
                }
                res.redirect('/' + conversation.name);
            }
        }
    }).catch(err => console.log(err));
});

//Send message to conversation
router.post('/:id', (req, res) => {
    var conversationName = req.params.id;
    Conversation.findOne({name: conversationName}, (err, conversation) => {
        if (!conversation) {
            res.redirect('/conversations');
        } else {
            if (!conversation.isParticipant(req.user.username)) {
                res.redirect('/conversations');
                console.log("You are not a member of this conversation!")
            } else {

              var message = req.body.message;
              var user = req.user;

              if (conversation.admin == user.username && message.startsWith("+")) {
                var command = message.split('+');
                var newMember = command[1];
                console.log(newMember);

                User.findOne({username:command[1]}, user => {
                  if (user) {
                    conversation.addParticipant(command[1])
                  } else {
                    dialog.info("User not found");
                  }
                }).catch(err => {
                  console.log(err);
                });
              }

                const newMessage = new Message({
                    conversation: conversation._id,
                    content: message,
                    sender: user.username
                });

                newMessage.save().then(message => {
                    console.log("New Message send: " + message);
                    res.redirect('/' + conversation.name);
                }).catch(err => console.log(err));
            }
        }
    }).catch(err => console.log(err));
});

module.exports = router;
