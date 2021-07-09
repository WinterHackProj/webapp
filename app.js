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

app.listen(process.env.PORT || 3000, () => {
    console.log('The small games app is running')
})