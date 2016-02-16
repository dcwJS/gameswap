module.exports = {
	users: 'CREATE TABLE IF NOT EXISTS `Users` (`id` INTEGER NOT NULL auto_increment, `firstname` MEDIUMTEXT NULL DEFAULT NULL,`lastname` MEDIUMTEXT NULL DEFAULT NULL,`username` MEDIUMTEXT NULL DEFAULT NULL, `password` MEDIUMTEXT NULL DEFAULT NULL, `email` MEDIUMTEXT NULL DEFAULT NULL, `phone` MEDIUMTEXT NULL DEFAULT NULL, `street` MEDIUMTEXT NULL DEFAULT NULL, `city` MEDIUMTEXT NULL DEFAULT NULL, `state` MEDIUMTEXT NULL DEFAULT NULL, `zip` INTEGER NULL DEFAULT NULL, `geoloc` MEDIUMTEXT NULL DEFAULT NULL, `rating` INTEGER NULL DEFAULT NULL, `profilepic` MEDIUMTEXT NULL DEFAULT NULL, `createdat` TIMESTAMP, PRIMARY KEY (`id`));',

	offering: 'CREATE TABLE IF NOT EXISTS `Offering` (`id` INTEGER NOT NULL auto_increment, `gameid` INTEGER NULL DEFAULT NULL, `userid` INTEGER NULL DEFAULT NULL, `game_condition` MEDIUMTEXT NULL DEFAULT NULL, `image` MEDIUMTEXT NULL DEFAULT NULL, `createdat` TIMESTAMP, PRIMARY KEY (`id`));',

	seeking: 'CREATE TABLE IF NOT EXISTS `Seeking` (`id` INTEGER NOT NULL auto_increment, `gameid` INTEGER NULL DEFAULT NULL, `userid` INTEGER NULL DEFAULT NULL, `createdat` TIMESTAMP, PRIMARY KEY (`id`));',

	games: 'CREATE TABLE IF NOT EXISTS `Games` (`id` INTEGER NOT NULL auto_increment, `title` MEDIUMTEXT NULL DEFAULT NULL, `rating` INTEGER NULL DEFAULT NULL, `description` MEDIUMTEXT NULL DEFAULT NULL, `platform` MEDIUMTEXT NULL DEFAULT NULL, `thumbnail` MEDIUMTEXT NULL DEFAULT NULL, `createdat` TIMESTAMP, PRIMARY KEY (`id`));',

	messages: 'CREATE TABLE IF NOT EXISTS `Messages` (`id` INTEGER NOT NULL auto_increment, `message` MEDIUMTEXT NULL DEFAULT NULL, `userfrom` MEDIUMTEXT NULL DEFAULT NULL, `lobby` MEDIUMTEXT NULL DEFAULT NULL, `createdat` TIMESTAMP, PRIMARY KEY (`id`));',

  chatrooms: 'CREATE TABLE IF NOT EXISTS `Chatrooms` (`id` INTEGER NOT NULL auto_increment, `lobby` MEDIUMTEXT NULL DEFAULT NULL, `userone` INTEGER NULL DEFAULT NULL, `usertwo` INTEGER NULL DEFAULT NULL, `createdat` TIMESTAMP, PRIMARY KEY (`id`));',

  create: function () {
  	connection.query(this.users, function (err){
  		if (err) {
				console.error('error while creating users table: ', err);
			}
		});

  	connection.query(this.offering, function (err) {
  		if (err) {
				console.error('error while creating offering table: ', err);
			}
		});

	connection.query(this.seeking, function (err) {
  		if (err) {
				console.error('error while creating seeking table: ', err);
			}
		});

   	connection.query(this.games, function (err) {
  		if (err) {
				console.error('error while creating games table: ', err);
			}
		});

	connection.query(this.messages, function (err) {
  		if (err) {
				console.error('error while creating messages table: ', err);
			}
		});

  connection.query(this.chatrooms, function (err) {
      if (err) {
        console.error('error while creating chatrooms table: ', err);
      }
    });
  }

}
