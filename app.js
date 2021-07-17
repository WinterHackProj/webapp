const express = require('express')
const app = express()
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash-plus');
const dotenv = require('dotenv').config()

// setup a session store signing the contents using the secret key
app.use(session({
    secret: process.env.PASSPORT_KEY,
    resave: true,
    saveUninitialized: true
}));

// start to operate passport 
app.use(passport.initialize());

// use session to store user object
app.use(passport.session());

// use flash to store messages
app.use(flash());

app.use(express.urlencoded({ extended: true }))
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json())

app.use(express.static('public'))
const exphbs = require("express-handlebars")


// configure passport authenticator
require('./config/passport')(passport);

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

require('./models');

const customerRouter = require('./routes/customerRouter.js')
const subjectRouter = require('./routes/subjectRouter')

// Allocate routes
app.use('/', customerRouter)
app.use('/subject', subjectRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log('The app is running')
})