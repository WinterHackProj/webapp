const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
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
app.use(bodyParser.urlencoded())
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
    result = await Subject.find({}).lean()
    res.render('subjectPage', {
        subjectInfo: result[0]
    })
})
app.get('/calcDescription', urlencodedParser, async(req, res) => {
    res.render("intro")
})

app.post('/subjectInfo', urlencodedParser, async(req, res) => {
    res.send(req.body)
})


app.listen(process.env.PORT || 3000, () => {
    console.log('The small games app is running')
})