var express = require('express');
var router = express.Router();
var auth = require('./auth');
var db = require('../database/database');

var bcrypt = require('bcrypt');

var Promise = require('bluebird')

/**
  *signin route takes a user email and password,
  *checks to see the user exists, if so, compare
  *password with stored password and return a token
  *if the passwords matched. Otherwise respond with
  *status code 500
  *
  @param  user: {
            email: [String],
            password: [String]
          }
  @return {String} JWT || 500
*/
router.post('/signin',function(req, res, next) {
  email = req.body.user.email;
  password = req.body.user.password;

  db.findUser(email, function(data) {
    if(data.length){
      var foundUser = data[0];
      bcrypt.compare(password, foundUser.password, function(err, result){
        if(err) {
          throw err
        }
        if(result) {
          foundUser.id;
          console.log('success logging in');
          auth.authenticateUser(foundUser.id, email, res, req);
        }else {
          console.error('failed logging '+email+'in!');
          res.sendStatus(500);
        }
      });
    }else {
      console.error('user',email,'not found');
      res.sendStatus(500);
    }
  });
});

/**
  *signup route takes a username, email, password, and city,
  *then checks to see if the user exists, if so sends 500,
  *otherwise hashes password, creates new user, and responds
  *with a token
  *
  @param  user: {
            email: [String],
            password: [String],
            username: [String],
            city: [String]
          }
  @return {String} JWT || 500
*/
router.post('/signup',function(req, res, next) {
  var username = req.body.user.username;
  var email = req.body.user.email;
  var password = req.body.user.password;
  var city = req.body.user.city;

  db.findUser(email,function(data) {
    if(!data.length) {
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash){
          db.addUser(email, username, hash, city, function(user) {
            id =  user[0].id;
            auth.authenticateUser(id, email, res);
        });
      });

    });
    }else {
      console.error('user already '+email+' exists!');
      res.sendStatus(500);
    }
  });
});
/**
  *profile route returns the profile data that corresponds
  *to the token in the request
  *
  @param None
  @return {User Profile}
*/
router.post('/profile', auth.checkUser, function(req, res, next) {
  var userInfo = {};
  var offerings, seeking;

  db.allOfferingByUser(req.user.id, function(data) {
    offerings = data;
  });
  db.allSeekingByUser(req.user.id, function(data) {
    seeking = data;
  });
  db.findUser(req.user.email, function(info) {
    info = info[0];
    userInfo.id = info.id;
    userInfo.firstname = info.firstname;
    userInfo.lastname = info.lastname;
    userInfo.username = info.username;
    userInfo.email = info.email;
    userInfo.phone = info.phone;
    userInfo.street = info.street;
    userInfo.city = info.city;
    userInfo.state = info.state;
    userInfo.zip = info.zip;
    userInfo.offerings = offerings;
    userInfo.seeking = seeking;

    res.json(userInfo);
  });
});

/**
  *profile/update route updates a users profile data and
  *responds with a status code
  *
  @param
  @return 201
*/
router.put('/profile/update', auth.checkUser, function(req, res, next) {
  var userid = req.user.id,
    phone = req.body.user.phone || null,
    street = req.body.user.street  || null,
    city = req.body.user.city || null,
    state = req.body.user.state || null,
    zip = req.body.user.zip  || null,
    geoloc = req.body.user.geoloc || null,
    profilepic = req.body.user.profilepic || null;

  db.addUserProfile(
    userid,
    phone,
    street,
    city,
    state,
    zip,
    geoloc,
    profilepic
  );

  res.sendStatus(201);
});

/**
  *
  @param game : {
              title: [String],
              platform: [String]
            }
  @return 201
*/
router.post('/addtoofferings', auth.checkUser, function(req, res, next) {
  var title = req.body.game.title;
  var platform = req.body.game.platform;
  var condition = 'default condition';
  var description = 'default description';
  var rating = 5;

  db.addGame(title, platform, rating, description, function(success) {
    db.addOffering(req.user.id, title, platform, condition);
    res.sendStatus(201);
  });
});

router.post('/searchofferings', function(req, res, next) {
  var game = req.body.game;

  if(game){
    db.searchOffering(game, function(results) {

      res.json({results: results});
    });
  }else {
    res.sendStatus(500);
  }


});
router.post('/addtoseeking', auth.checkUser, function(req, res, next) {
  var title = req.body.game.title;
  var platform = req.body.game.platform;
  var description = 'default description';
  var rating = 5;

  db.addGame(title, platform, rating, description, function(success) {
    db.addSeeking(req.user.id, title, platform);
    res.sendStatus(201);
  });

});

router.post('/searchseeking', auth.checkUser, function(req, res, next) {
  var game = req.body.game;

  if(game){
    db.searchSeeking(game, function(results) {

      res.json({results: results});
    });
  }else {
    res.sendStatus(500);
  }
});

router.get('/getrooms', auth.checkUser, function(req, res, next){
  var userto = req.user.id;
  console.log('getting messages route hit');

  console.log('req.user in getmessages route: ', req.user)
  db.findLobbyUser(userto, function(results){
    console.log('+++line221: results', results);
    res.json({results: results});
  })
})

router.post('/addmessage', auth.checkUser, function(req, res, next) {
  var userfrom = req.user.id;
  var userto = req.body.message.to;
  var message = req.body.message.text;

  db.addMessage(userfrom, userto, message);
  res.sendStatus(201);
});

router.post('/api/chatroom', auth.checkUser, function(req, res, next) {
  var users = req.body.users;
  db.addLobby(users, function(){
    res.sendStatus(201);
  })
})


module.exports = router;
