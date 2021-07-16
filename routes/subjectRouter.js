const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const utilities = require("../middleware/utility");
const subjectRouter = express.Router()
const subjectController = require('../controllers/subjectController')

const Assignment = require('../models/assignment')
const subject = require('../models/subject')
const Subject = subject.Subject

// / and /subject-detail are the same, put the css to / later
// have id after
subjectRouter.get('/', async(req, res) => {
    result = await Subject.find({}).lean()
    res.render('subjectPage', {
        subjectInfo: result[0]
    })
})

subjectRouter.get('/subject-detail', utilities.isLoggedIn, async(req, res) => {
    res.render('subject-detail')
})

/*********************/

subjectRouter.get('/add-subject', utilities.isLoggedIn, async(req, res) => {
    res.render('add-subject')
})

subjectRouter.get('/assignment', utilities.isLoggedIn, async(req, res) => {
    result = await Assignment.find({})
    res.send(result)
})

subjectRouter.get('/calcDescription', utilities.isLoggedIn, async(req, res) => {
    res.render("intro")
})

// handle the POST request to save target grade
subjectRouter.post('/', utilities.isLoggedIn, urlencodedParser, (req, res) => subjectController.saveTargerGrade(req, res))
subjectRouter.post('/report', utilities.isLoggedIn, urlencodedParser, (req, res) => subjectController.displayReport(req, res))

// export the router
module.exports = subjectRouter