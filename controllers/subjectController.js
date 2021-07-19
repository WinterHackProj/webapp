const Assignment = require('../models/assignment')
const subject = require('../models/subject')
const Subject = subject.Subject
const customer = require("../models/customer")
const Customer = customer.Customer
const CustomerSubject = customer.CustomerSubject

function checkValidity(scoreObject) {
    console.log(scoreObject)
    return 0
}

function allocateRemainingScore(requiredEach, totalForThisAssignment, totalForRemainingAssignments){
    var ratio = totalForThisAssignment/totalForRemainingAssignments
    return requiredEach*ratio
}

const getAddSubject = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        res.render('add-subject', { "thiscustomer": customer })
    } catch {
        console.log(err)
        return res.send("cannot GET the subject")
    }
}

const addSubject = async(req, res) => {
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
        assignments: []
    }
    var subject = new Subject(postData)
    subjectRecord = new CustomerSubject({ SubjectId: subject._id, subject_code: req.body.subject_code.toUpperCase() })
        // new user
    if (subjects.length === 0) {
        subjects.push(subjectRecord)
        await Customer.updateOne({ "email": req.session.email }, { "subjects": subjects }).lean()
        await subject.save()
    } else {
        // check if the subject is already in canvas
        for (var i = 0; i < subjects.length; i++) {
            if (req.body.subject_code.toUpperCase() === subjects[i].subject_code) {
                return res.render("cannotAddSubjectError")
            }
        }
        subjects.push(subjectRecord)
        await Customer.updateOne({ "email": req.session.email }, { "subjects": subjects }).lean()
        await subject.save()
    }
    return res.render('addSubjectSuccess', { "thiscustomer": customer })
        // } 
        // catch{
        //     console.log(err)
        //     return res.send("cannot add the subject")
        // }

}

const deleteSubject = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    await Customer.updateOne({ "email": req.session.email }, { $pull: { subjects: { "SubjectId": req.session.subjectId } } }).lean()
    return res.render('deleteSubject', { "thiscustomer": customer })
}

//save subject target grades
const saveTargerGrade = (req, res) => {
    var subject_code = Object.keys(req.body)[0];
    var target_grade = Object.values(req.body)[0];
    Subject.updateOne({ subject_code: { $eq: subject_code } }, { target: target_grade },
        function(err, docs) {
            if (err) {
                console.log(err)
            } else {
                console.log("Updated Docs:", docs);
            }
        }
    )
    res.redirect('back')
}

const doCalculation = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    const subjectInfo = await Subject.findOne({ "_id": req.body.subjectId }).lean()
    console.log(req.body)
    var indicesEmpty = []
    var obtainedScore = req.body.obtainedScore
    var totalScore = req.body.totalScore
    var overallTarget = req.body.overallTarget
    var sumScore = 0
    var totalRemaining = 0
    console.log(obtainedScore)
    for (var i=0;i<obtainedScore.length;i++){
        if (!obtainedScore[i]){
            indicesEmpty.push(i)
            totalRemaining += totalScore[i]
        }
        else{
            sumScore += obtainedScore[i]
        }
    }
    var requiredEach = (overallTarget - sumScore)/indicesEmpty.length
    for (var i=0;i<indicesEmpty.length;i++){
        obtainedScore[indicesEmpty[i]] = allocateRemainingScore(requiredEach, totalScore[indicesEmpty[i]], totalRemaining)
    }
    console.log(obtainedScore)
    res.render('subject-detail', { "subjectInfo": subjectInfo, "thiscustomer": customer })
}

const getEachSubject = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    const subjectInfo = await Subject.findOne({ "_id": req.params._id }).lean()
    req.session.subjectId = req.params._id
    res.render('subject-detail', { "subjectInfo": subjectInfo, "thiscustomer": customer })
}

const addScore = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    const subjectInfo = await Subject.findOne({ "_id": req.body.subject }).lean()
    var assignList = req.body.assignments.split(",")
    var percentList = req.body.percentages.split(",")
    var scoresList = req.body.scores.split(",")
    var targetsList = req.body.targets.split(",")
    var assLength = assignList.length
    var subjectId = req.body.subject
    var gradeInfo = {assignList, percentList, scoresList, targetsList, assLength, subjectId}
    res.render('subjectPage', { "subjectInfo": subjectInfo, "thiscustomer": customer, "gradeInfo": gradeInfo })
}

// Export the functions
module.exports = {
    saveTargerGrade,
    doCalculation,
    getAddSubject,
    addSubject,
    getEachSubject,
    deleteSubject,
    addScore
}