const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const subjectRouter = express.Router()
const subjectController = require('../controllers/subjectController')

const Assignment = require('../models/assignment')
const subject = require('../models/subject')
const Subject = subject.Subject

subjectRouter.get('/', async(req, res) => {
    result = await Subject.find({}).lean()
    res.render('subjectPage', {
        subjectInfo: result[0]
    })
})

subjectRouter.get('/assignment', async(req, res) => {
    result = await Assignment.find({})
    res.send(result)
})

subjectRouter.get('/calcDescription', urlencodedParser, async(req, res) => {
    res.render("intro")
})

// handle the POST request to save target grade
subjectRouter.post('/', urlencodedParser, (req, res) => subjectController.saveTargerGrade(req, res))
subjectRouter.post('/report', urlencodedParser, (req, res) => subjectController.displayReport(req, res))

// export the router
module.exports = subjectRouter