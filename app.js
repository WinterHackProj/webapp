const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express()
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash-plus');
const dotenv = require('dotenv').config()

// configure passport authenticator
// require('./config/passport')(passport);

const exphbs = require("express-handlebars")
const router = require('./routes.js')

require('./models');
app.use(express.static('public'))
app.use(bodyParser.urlencoded())
app.use('/', router)

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

// Require routers
const subjectRouter = require('./routes/subjectRouter')

// Allocate routes
app.use('/subject', subjectRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log('The small games app is running')
})