/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const passport = require('passport');
module.exports = {
	login: function(req, res) {
		console.log(req.param)
		let user_id = req.param ? req.param('user_id'): '';
    passport.authenticate('local', function(err, user, info){
      if((err) || (!user)) {
        return res.send({
          message: info.message,
          user
        });
      }
		req.logIn(user, function(err) {
	        if(err) {
						res.send(err);
					}
					if (user_id) {
						console.log('We have a user ID!!!', user_id);
						return res.redirect(`/user/${user_id}`);
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
    return res.redirect('/');
  }
};
