// import required dependencies 
const express = require('express')
// const utilities = require("./utility");
const passport = require('passport');
require('../config/passport')(passport);

// add our router 
const customerRouter = express.Router()

// add the customer controller
// const customerController = require('../controllers/customerController.js');

customerRouter.get("/", (req, res) => {
    // res.send(req.session.email)
    res.send(req.session.email)
    // res.send("login successfully good")
    // res.render('login', { layout: 'beforeLogin.hbs', message: req.flash('loginMessage') });
});

customerRouter.get("/login", (req, res) => {
    res.send("login fails")
    // res.render('login', { layout: 'beforeLogin.hbs', message: req.flash('loginMessage') });
});

//handle the POST request for login
customerRouter.post('/login', passport.authenticate('local-login', {
    successRedirect: '/customer', // redirect to the homepage
    failureRedirect: '/customer/login', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}));

//handle the GET request to register
customerRouter.get('/register', function(req, res) {
    res.send("register fails")
    // res.render('register', { layout: 'beforeLogin.hbs', message: req.flash('signupMessage') })
});

//handle the POST request to register
customerRouter.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/customer', // redirect to the homepage
    failureRedirect: '/customer/register', // redirect to signup page
    failureFlash: true // allow flash messages
}));

//logout
customerRouter.get('/logout', function(req, res) {
    delete req.session.email;
    req.logout();
    res.redirect('/customer');
})

// export the router
module.exports = customerRouter