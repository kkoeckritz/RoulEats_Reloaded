// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dbconfig = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
};
var connection = mysql.createConnection(dbconfig);

var db = require("../models");

connection.query('USE ' + process.env.DATABASE_DB);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            db.User.findOne({ where: { username: username } }).then( user => {
                console.log(`Find one executed, value is: ${user}`);
                if (user) { // user name taken
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } 
                else { // otherwise create new user
                    var encryptedPassword = bcrypt.hashSync(password, null, null);
                    db.User.create({ username: username, password: encryptedPassword }).then(dbUser => {
                        return done(null, dbUser);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );

    // =========================================================================
    // FACEBOOK LOGIN =============================================================
    // =========================================================================
    var fbConfig = {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK
    };
    
    var fbCallback = function(req, accessToken, refreshToken, profile, done) {
        console.log(`accessToken: ${accessToken}`);
        console.log(`refreshToken: ${refreshToken}`);
        console.log(`profile: ${JSON.stringify(profile)}`);
        done(null, profile);

        let query = "SELECT * FROM users WHERE facebook_id = ?";
        connection.query(query, [profile.id], function(err, rows) {
            if (err) return done(err);
            var newUserMysql = {};

            if (rows.length) {
                newUserMysql.id = rows[0].id;
                return done(null, newUserMysql);
            } else {
                // if there is no user with that username
                // create the user

                var query = "INSERT INTO users ( username, facebook_id, password, name ) values (?,?,?)";
                var values = [profile.id, profile.id, "facebook", profile.displayName];
                connection.query(query, values, function(err, rows) {
                    if (err) throw err;

                    newUserMysql.id = rows.insertId;

                    return done(null, newUserMysql);
                });
            }
        });
    };

    passport.use(new FacebookStrategy(fbConfig, fbCallback));
};
