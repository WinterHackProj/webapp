const express = require('express')
const app = express()
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash-plus');
const dotenv = require('dotenv').config()

const Assignment = require('./models/assignment')
const subject = require('./models/subject')
const Subject = subject.Subject
// configure passport authenticator
// require('./config/passport')(passport);

require('./models');
app.use(express.static('public'))
const exphbs = require("express-handlebars")

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}))

app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/assignment', async (req, res) => {
    result = await Assignment.find({})
    res.send(result)
})
app.get('/subject', async (req, res) => {
    result = await Subject.find({})
    res.send(result)
})

app.listen(process.env.PORT || 3000, () => {
    console.log('The small games app is running')
})