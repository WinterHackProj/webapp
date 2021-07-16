const express = require('express')
const app = express()

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

app.get('/login', (req, res) => {
    res.render('login', { layout: "login-layout" })
})

app.get('/add-subject', (req, res) => {
    res.render('add-subject')
})

app.get('/subject-detail', (req, res) => {
    res.render('subject-detail')
})

app.listen(process.env.PORT || 3000, () => {
    console.log('The small games app is running')
})