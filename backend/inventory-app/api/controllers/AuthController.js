/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const passport = require('passport');
module.exports = {
	login: function(req, res) {
		console.log('inside login function')
    passport.authenticate('local', function(err, user, info){
      if((err) || (!user)) {
        return res.send({
          message: info.message,
          user
        });
      }
		console.log('user:');
		console.log(user)
		req.logIn(user, function(err) {
	        if(err) {
						res.send(err);
					}
	        return res.send({
	          message: info.message,
	          user
	        });
	      });
	    })(req, res);
  },
	logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};
