/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

// User is allowed, proceed to the next policy,
// or if this is the last policy, the controller
module.exports = function (req, res, next) {
  // User is allowed, proceed to controller
  var is_auth = req.isAuthenticated();
  if (is_auth) {
    return next();
  } else {
    return res.forbidden('You are not permitted to perform this action.');
  }
  // User is not allowed
};
