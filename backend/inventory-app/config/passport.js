const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const localStrategyHandler = function(username, password, cb){
  User.findOne({username: username}, function(err, user){
    if(err) return cb(err);
    if(!user) return cb(null, false, {message: 'Username not found'});
    bcrypt.compare(password, user.password, function(err, res) {
      if(!res) return cb(null, false, { message: 'Invalid Password' });
      let userDetails = {
        email: user.email,
        username: user.username,
        id: user.id
      };
      return cb(null, userDetails, { message: 'Login Succesful'});
    });
  });
}

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function(id, cb){
  User.findOne({id}, function(err, user) {
    cb(err, users);
  });
});
passport.use(new LocalStrategy({
  usernameField: 'username',
  passportField: 'password'
}, localStrategyHandler));
