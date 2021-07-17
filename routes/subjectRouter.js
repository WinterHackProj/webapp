const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const utilities = require("../middleware/utility");
const subjectRouter = express.Router()
const subjectController = require('../controllers/subjectController')

const Assignment = require('../models/assignment')

// adding a subject to customer's array
subjectRouter.get('/add-subject', utilities.isLoggedIn, subjectController.getAddSubject)

// add a subject to the subjects array of the current customer
subjectRouter.post('/add-subject', utilities.isLoggedIn, subjectController.addSubject)

subjectRouter.post('/delete-subject', utilities.isLoggedIn, subjectController.deleteSubject)

subjectRouter.get('/assignment', utilities.isLoggedIn, async(req, res) => {
    result = await Assignment.find({})
    res.send(result)
})

subjectRouter.get('/calcDescription', utilities.isLoggedIn, async(req, res) => {
    res.render("intro")
})

// handle the POST request to save target grade
subjectRouter.post('/', utilities.isLoggedIn, urlencodedParser, subjectController.saveTargerGrade)
subjectRouter.post('/report', utilities.isLoggedIn, urlencodedParser, subjectController.displayReport)

subjectRouter.get('/:_id', utilities.isLoggedIn, subjectController.getEachSubject)

// export the router
module.exports = subjectRouter