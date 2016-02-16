var mysql = require('mysql');
var tables = require('./tables.js');
var db_config = require('./dbConfig.js');

var createConnection = function createConnection() {
    connection = mysql.createConnection(db_config);

    connection.connect(function (err) {
        if (err) {
          console.error('error connecting: ' + err.stack);
        }
    });

    connection.on('error',function(err){
        console.error(err);
        createConnection();
    });
};

createConnection();

tables.create();

module.exports = {
  findUser: function (email, callback) {
    var sql = 'SELECT * FROM Users WHERE email = ?;'
    var values = email;

    connection.query(sql, values, function (err, data) {
      if (err) {
        console.error("error in db findUser: ", err);
      }

      callback(data);
    });
  },

  addUser: function (email, username, password, city, geoloc, callback) {
    var sql = 'INSERT into Users (email, username, password, city, geoloc) values(?, ?, ?, ?, ?);';
    var values = [email, username, password, city, geoloc];

    connection.query(sql, values, function(err){
      if(err) {
        console.error('error in db addUser: ', err);
      }
    });

    connection.query('SELECT id FROM Users WHERE email = ?;', email, function(err, data) {
      if(err) {
        console.error("error in db addUser: ", err);
      }
      callback(data);
    });
  },

  addUserProfile: function (userid, phone, street, city, state, zip, geoloc, profilepic) {
    var sql = "UPDATE Users SET phone = ?, street = ?, city = ?, state = ?, zip = ?, geoloc = ?, profilepic = ? WHERE id = '" + userid + "';"
    var values = [phone, street, city, state, zip, geoloc, profilepic];

    connection.query(sql, values, function(err){
      if (err) {
        console.error('error in db addUserProfile: ', err);
      }
    });
  },

  addGame: function (title, platform, rating, description, callback) {
    var check = 'SELECT * FROM Games WHERE title = ? AND platform = ?;'
    var checkValues = [title, platform];
    var insert = 'INSERT IGNORE into Games (title, platform, rating, description) values(?, ?, ?, ?);';
    var insertValues = [title, platform, rating, description];

    connection.query(check, checkValues, function(err, data) {
      if (err) {
        console.error('error 1 in db addGame: ', err);
      }

      if (data.length === 0) {
        connection.query(insert, insertValues, function(err) {
          if (err) console.error('error 2 in db addGame: ', err);
          else callback(true);
        });
      } else {
        callback(false);
      }
    });
  },

  addOffering: function (userid, title, platform, condition) {
    var check = 'SELECT id FROM Games WHERE title = ? AND platform = ?;';
    var checkValues = [title, platform];
    var insert = 'INSERT into Offering (userid, game_condition, gameid) values( ?, ?, ?);';
    var insertValues = [userid, condition];

    connection.query(check, checkValues, function (err, data) {
      if (err) {
        console.error('error 1 in db addOffering: ', err);
      }
      insertValues.push(data[0].id);
      connection.query(insert, insertValues, function(err, data) {
        if (err) {
          console.error('error 2 in db addOffering: ', err);
        }
      });
    });
  },

  addSeeking: function (userid, title, platform) {
    var check = 'SELECT id FROM Games WHERE title = ? AND platform = ?;';
    var checkValues = [title, platform];
    var insert = 'INSERT into Seeking (userid, gameid) values( ?, ?);';
    var insertValues = [userid];

    connection.query(check, checkValues, function (err, data) {
      if (err) {
        console.error('error 1 in db addSeeking: ', err);
      }

      insertValues.push(data[0].id);
      connection.query(insert, insertValues, function(err, data) {
        if (err) {
          console.error('error 2 in db addSeeking: ', err);
        }
      });
    });
  },

  searchOffering: function (title, callback) {
    var sql = "SELECT Games.title, Games.rating, Games.description, Games.platform, Games.thumbnail, Offering.game_condition, Offering.createdat, Users.username, Users.id, Users.city, Users.state, Users.zip, Users.geoloc FROM Games, Offering, Users WHERE Games.title = '" + title + "' AND Games.id = Offering.gameid AND Offering.userid = Users.id;";

    connection.query(sql, function (err, data) {
      if (err) {
        console.error('error in db searchOffering: ', err);
      }
      callback(data);
    })
  },

  searchSeeking: function (title, callback) {
    var sql = "SELECT Games.title, Games.rating, Games.description, Games.platform, Games.thumbnail, Seeking.createdat, Users.username, Users.id, Users.city, Users.state, Users.zip, Users.geoloc FROM Games, Seeking, Users WHERE Games.title = '" + title + "' AND Games.id = Seeking.gameid AND Seeking.userid = Users.id;";

    connection.query(sql, function (err, data) {
      if (err) {
        console.error('error in db searchSeeking: ', err);
      }
      callback(data);
    });
  },

  allOfferingByUser: function (userid, callback) {
    var sql = "SELECT Games.title, Games.rating, Games.description, Games.platform, Games.thumbnail, Offering.createdat FROM Games, Offering WHERE Games.id = Offering.gameid AND Offering.userid = '" + userid + "';";

    connection.query(sql, function (err, data) {
      if (err) {
        console.error('error in db allSeeking: ', err);
      }
      callback(data);
    });
  },

  allSeekingByUser: function (userid, callback) {
    var sql = "SELECT Games.title, Games.rating, Games.description, Games.platform, Games.thumbnail, Seeking.createdat FROM Games, Seeking WHERE Games.id = Seeking.gameid AND Seeking.userid = '" + userid + "';";

    connection.query(sql, function (err, data) {
      if (err) {
        console.error('error in db allSeeking: ', err);
      }
      callback(data);
    });
  },

  addMessage: function (message, userfrom, lobbyname) {
    var sql = "INSERT into Messages (message, userfrom, lobby) values (?, ?, ?);";
    var values = [message, userfrom, lobbyname];

    connection.query(sql, values, function (err) {
      if (err) {
        console.error('error in db addMessage: ', err);
      }
    });
  },

  loadMessages: function (lobbyname, callback) {
    var sql = "SELECT * FROM Messages WHERE lobby = ?;";
    console.log('+++ line185 lobby name = ' + lobbyname);

    connection.query(sql, lobbyname, function (err, data) {
      if (err) {
        console.error('error in db loadMessages: ', err);
      }
      callback(data);
    })
  },

  allRooms: function (userid, callback) {
    var sql = "SELECT Chatrooms.lobby, Chatrooms.createdat, Users.username, Users.id, Users.email FROM Users, Chatrooms WHERE Chatrooms.usertwo = ? AND Chatrooms.userone = Users.id;";
    console.log('++++ line192: ' , userid);

    connection.query(sql, userid, function (err, data) {
      if (err) console.error('error in db allMessages: ', err);
      callback(data);
    });
  },

  addLobby: function (users, callback) {
    var userone = users.userone;
    var usertwo = users.usertwo;

    this.findUsername(userone, function (useroneId) {
      this.findUsername(usertwo, function (usertwoId) {
        var lobby = '' + useroneId[0].email + usertwoId[0].email
        var userNames = {one: useroneId[0].email, two: usertwoId[0].email}
        this.findLobbyName(userNames, function(room){
          if(!room.length){
            var sql = "INSERT into Chatrooms (lobby, userone, usertwo) values (?, ?, ?);";
            var values = [lobby, useroneId[0].id, usertwoId[0].id];

            connection.query(sql, values, function (err, data) {
              if (err) console.error('error in db addLobby: ', err);
              callback(true);
            })
          } else {
            callback(false);
          }
        })
      }.bind(this))
    }.bind(this))
  },

  findLobbyName: function (userNames, callback) {
    var sql = "SELECT * from Chatrooms WHERE lobby = ? OR lobby = ?;";
    var lobbyOne = '' + userNames.one + userNames.two;
    var lobbyTwo = '' + userNames.two + userNames.one;
    var lobbyName = [lobbyOne, lobbyTwo]
    connection.query(sql, lobbyName, function (err, data) {
      if (err) console.error('error in db findLobby: ', err);
      callback(data);
    })
  },

  findLobbyUser: function (userid, callback) {
    var sql = "SELECT * from Chatrooms WHERE userone = ? OR usertwo = ?;";

    var user = [userid, userid]
    connection.query(sql, user, function (err, data) {
      if (err) console.error('error in db findLobby: ', err);
      callback(data);
    })
  },

  findUsername: function (username, callback) {
    var sql = 'SELECT * FROM Users WHERE username = ?;'
    var values = username;

    connection.query(sql, values, function (err, data) {
      if (err) {
        console.error("error in db findUser: ", err);
      }

      callback(data);
    });
  }

}
