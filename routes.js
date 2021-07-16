const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const router = express.Router()

const Assignment = require('./models/assignment')
const subject = require('./models/subject')
const Subject = subject.Subject

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/assignment', async (req, res) => {
    result = await Assignment.find({})
    res.send(result)
})

router.get('/subject', async (req, res) => {
    result = await Subject.find({}).lean()
    res.render('subjectPage', {
        subjectInfo: result[0]
    })
})

router.get('/calcDescription', urlencodedParser, async(req, res) => {
    res.render("intro")
})

module.exports = router