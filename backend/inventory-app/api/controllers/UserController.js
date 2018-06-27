/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	findOne: function(req, res, next) {
    let id = req.params ? req.params.id : '';
		if (!req.isAuthenticated()) {
      if (!id) {
        res.redirect('/login');
      } else {
        res.redirect(`/login?user_id=${id}`);
      }
			return;
		}
		return next();
	}
};
