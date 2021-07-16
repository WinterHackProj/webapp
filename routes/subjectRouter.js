const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const utilities = require("../middleware/utility");
const subjectRouter = express.Router()
const subjectController = require('../controllers/subjectController')

const Assignment = require('../models/assignment')
const subject = require('../models/subject')
const Subject = subject.Subject
const customer = require("../models/customer")
const Customer = customer.Customer
const CustomerSubject = customer.CustomerSubject

// / and /subject-detail are the same, put the css to / later
// have id after
subjectRouter.get('/', utilities.isLoggedIn, async(req, res) => {
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
    try{
        // const customer = await Customer.findOne({ "email": req.session.email }).lean()
        // console.log(customer)
        // const subjects = customer.subjects
        res.render('add-subject')
    } catch{
        console.log(err)
        return res.send("cannot GET the subject")
    }
    
})

// add a subject to the subjects array of the current customer
subjectRouter.post('/add-subject', utilities.isLoggedIn, async(req, res) => {
    // try{
        // current customer
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        // the subjects the current customer has
        const subjects = customer.subjects
        //save the subjects
        var postData = {
            subject_code: req.body.subject_code.toUpperCase(),
            subject_name: req.body.subject_name,
            credit: req.body.credit,
            target: req.body.target,
            assignments:[]
        }
        var subject = new Subject(postData)
        subjectRecord = new CustomerSubject({ SubjectId: subject._id, subject_code: req.body.subject_code.toUpperCase() })
        // new user
        if(subjects.length === 0){
            subjects.push(subjectRecord)
            await Customer.updateOne({ "email": req.session.email }, { "subjects": subjects }).lean()
            await subject.save()
        }else{
            // check if the subject is already in canvas
            for(var i = 0; i < subjects.length; i++){
                if(req.body.subject_code.toUpperCase() === subjects[i].subject_code){
                    return res.render("cannotAddSubjectError")
                }
            }
            subjects.push(subjectRecord)
            await Customer.updateOne({ "email": req.session.email }, { "subjects": subjects }).lean()
            await subject.save()
        }
        return res.render('addSubjectSuccess')
    // } 
    // catch{
    //     console.log(err)
    //     return res.send("cannot add the subject")
    // }
    
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