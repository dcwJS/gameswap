var jwt = require('jwt-simple');
var secret = '123';
module.exports = {
  checkUser : function(req, res, next) {
    if(!req.headers['x-access-token']) {
      res.sendStatus(500);
    }

    var decodedToken = jwt.decode(req.headers['x-access-token'], secret)

    if(decodedToken.scope === scope) {
      req.user = {};
      req.user.id = decodedToken.id;
      req.user.email = decodedToken.email;
      next();
    } else {
      res.sendStatus(500);
    }
},

authenticateUser : function(id, email, res, req){
    var payload = {id: id, email: email};
    var token = jwt.encode(payload, secret);

    res.set('token', token);
    res.json({token: token});
  }
}
