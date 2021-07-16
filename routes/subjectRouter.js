const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const subjectRouter = express.Router()
const subjectController = require('../controllers/subjectController')


// handle the POST request to save target grade
subjectRouter.post('/', urlencodedParser, (req, res) => subjectController.saveTargerGrade(req, res))
subjectRouter.post('/report', urlencodedParser, (req, res) => subjectController.displayReport(req, res))

// export the router
module.exports = subjectRouter
