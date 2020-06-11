const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User Model
const user = require('../models/Users');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
      // Match User
      user.findOne({ email: email })
      .then( user =>{
        if(!user) {
          return done(null, false, {message: 'That email is not registered'});
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if(isMatch){
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        })
      })
      .catch( err => console.log(err))
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
      done(err, user);
    });
  });

}