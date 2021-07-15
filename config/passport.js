// import required dependencies
require('dotenv').config()
const validator = require("email-validator");
// used to create our local strategy for authenticating using username and password
const LocalStrategy = require('passport-local').Strategy;

// import required models
const { Customer } = require('../models/customer');

module.exports = function(passport) {

    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using user's object id
    passport.serializeUser(function(customer, done) {
        console.log(customer)
        done(null, customer._id);
    });

    passport.deserializeUser(function(_id, done) {
        Customer.findById(_id, function(err, customer) {
            done(err, customer);
        });
    });
    // strategy to login which takes in username and password
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, // pass the req as the first arg to the callback for verification 
        function(req, email, password, done) {
            process.nextTick(function() {
                // see if the user with the email exists
                Customer.findOne({ 'email': email }, function(err, customer) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    if (err)
                        return done(err);
                    if (!customer)
                        return done(null, false, req.flash('loginMessage', 'No user found.'));

                    if (!customer.validPassword(password)) {
                        // the strategy that authentication has failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the user's email in the session
                    else {
                        // put the user's email in the session so that it can now be used for all
                        // communications between the client and the app
                        req.session.email = email;
                        return done(null, customer);
                    }
                });
            });

        }));

    // for signup
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, // pass the req as the first arg to the callback for verification 

        function(req, email, password, done) {
            process.nextTick(function() {
                if (req.body.email === "" || req.body.password === "" || req.body.first_name === "" || req.body.last_name === "") {
                    return done(null, false, req.flash('signupMessage', 'please input all information below'));
                }
                Customer.findOne({ 'email': email }, function(err, existingCustomer) {
                    // search a user by the email 
                    // if user is not found or exists, exit with false indicating
                    // authentication failure
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (existingCustomer) {
                        console.log("existing");
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    if (!validator.validate(email)) {
                        return done(null, false, req.flash('signupMessage', 'Please input your email correctly'));
                    }
                    if (!req.body.passowrd == req.body.passowrd2) {
                        return done(null, false, req.flash('signupMessage', 'Please input the same passowrd twice.'));
                    } else {
                        // otherwise create a new user
                        var newCustomer = new Customer();
                        newCustomer.email = email;
                        newCustomer.password = newCustomer.generateHash(password);
                        newCustomer.nickName = req.body.nickName;
                        newCustomer.subjects = [];

                        req.session.email = email;
                        // and save the user
                        newCustomer.save(function(err) {
                            if (err)
                                throw err;

                            return done(null, newCustomer);
                        });
                    }
                });
            });
        }));
};