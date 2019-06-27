const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const configAuth = require('./auth');
const User = require('../models/user');
module.exports = function(passport) {
 console.log("module");
    passport.serializeUser(function(user, done){
        console.log("searialize",user);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
           console.log("dsearialize",user);
            done(err, user);
		});
	});




    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    }, function(accessToken , refreshToken , profile , done) {
        console.log("function");
                process.nextTick(function() {
                    User.findOne({'google.id' : profile.id} , function(err , user) {
                     console.log(1);
                        if (user) {
                            console.log(2);  return done(null , user);
                        }

                       else if (err) {
                        return done(err);
                        }

                        else { console.log(3);
                            var newUser = new User();
                            newUser.google.id = profile.id,
                            newUser.google.token = accessToken;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;

                            newUser.save(function(err) {
                                if(err) {
                                    console.log('Error from passport.js: 43');
                                    throw err;
                                }
                                return done(null , newUser);
                            });

                            console.log(profile);
                        }
                    });
                });
    }));
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL
    }, function(accessToken , refreshToken , profile , done) {
        
                process.nextTick(function() {
                    User.findOne({'facebook.id' : profile.id} , function(err , user) {
                     console.log(1);
                        if (user) {
                            console.log(2);  return done(null , user);
                        }

                       else if (err) {
                        return done(err);
                        }

                        else { console.log(3);
                            var newUser = new User();
                            newUser.facebook.id = profile.id,
                            newUser.facebook.token = accessToken;
                            newUser.facebook.name = profile.displayName;
                            //newUser.facebook.email = profile.emails;

                            newUser.save(function(err) {
                                if(err) {
                                    console.log('Error from passport.js: 43');
                                    throw err;
                                }
                                return done(null , newUser);
                            });

                            console.log(profile);
                        }
                    });
                });
    }));
}
