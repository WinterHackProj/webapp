const express = require('express')
const passport = require('passport');
require('../config/passport')(passport);
const utilities = require("../middleware/utility");

// add the router 
const customerRouter = express.Router()

// add the controller
const customerController = require('../controllers/customerController');

customerRouter.get("/", customerController.getIndex)

customerRouter.get('/portfolio', utilities.isLoggedIn, customerController.getPortfolio)

customerRouter.get("/login", (req, res) => {
    res.render('login', { layout: 'login-layout', message: req.flash('loginMessage') });
})

//handle the POST request for login
customerRouter.post('/login', passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the homepage
    failureRedirect: '/login', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}));

//handle the POST request to register
customerRouter.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the homepage
    failureRedirect: '/register', // redirect to signup page
    failureFlash: true // allow flash messages
}));

//logout
customerRouter.get('/logout', utilities.isLoggedIn, function(req, res) {
    delete req.session.email;
    req.logout();
    res.redirect('/');
})

// export the router
module.exports = customerRouter