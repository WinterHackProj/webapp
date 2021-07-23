const Assignment = require('../models/assignment')
const subject = require('../models/subject')
const Subject = subject.Subject
const customer = require("../models/customer")
const Customer = customer.Customer
const CustomerSubject = customer.CustomerSubject
const subjectAssignment = subject.subjectAssignment


function allocateRemainingScore(requiredEach, totalForThisAssignment, totalForRemainingAssignments) {
    var ratio = totalForThisAssignment / totalForRemainingAssignments
    return requiredEach * ratio
}

const getAddSubject = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        res.render('add-subject', { "thiscustomer": customer })
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }
}

const addSubject = async(req, res) => {
    try {
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
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }

}

const deleteSubject = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        await Customer.updateOne({ "email": req.session.email }, { $pull: { subjects: { "SubjectId": req.session.subjectId } } }).lean()
        const subject = await Subject.findOne({ "_id": req.session.subjectId }).lean()
        const assignment = subject.assignments
        for (let i = 0; i < assignment.length; i++) {
            await Assignment.deleteOne({ "_id": assignment[i].assignmentId }).lean()
        }
        await Subject.deleteOne({ "_id": req.session.subjectId }).lean()
        return res.render('deleteSubject', { "thiscustomer": customer })
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }
}

//save subject target grades
const saveTargerGrade = (req, res) => {
    try {
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
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }
}

const doCalculation = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        const subjectInfo = await Subject.findOne({ "_id": req.body.subjectId }).lean()
        var indicesEmpty = []
        var assignmentNames = req.body.assignmentName
        var obtainedScore = req.body.obtainedScore
        var targetScore = new Array(obtainedScore.length)
        var totalScore = req.body.totalScore
        var overallTarget = req.body.overallTarget
        var sumScore = 0
        var totalRemaining = 0
        if (typeof(assignmentNames) == "string") {
            assignmentNames = new Array(assignmentNames)
            obtainedScore = new Array(obtainedScore)
            totalScore = new Array(totalScore)
        }

        for (var i = 0; i < obtainedScore.length; i++) {
            if (!obtainedScore[i]) {
                indicesEmpty.push(i)
                totalRemaining += parseFloat(totalScore[i])
            } else {
                sumScore += parseFloat(obtainedScore[i])
            }
        }

        var requiredEach = overallTarget - sumScore

        for (var i = 0; i < indicesEmpty.length; i++) {
            targetScore[indicesEmpty[i]] = allocateRemainingScore(requiredEach, totalScore[indicesEmpty[i]], totalRemaining)
        }


        for (let i = 0; i < subjectInfo.assignments.length; i++) {
            await Assignment.deleteOne({ "_id": subjectInfo.assignments[i].assignmentId }).lean()
        }

        var assignmentInfo = []
        var allAssignments = []

        for (var i = 0; i < assignmentNames.length; i++) {
            var assignmentEntity = {}
            assignmentEntity.name = assignmentNames[i]
            assignmentEntity.percentage = totalScore[i]
            assignmentEntity.current_score = obtainedScore[i]
            if (!isNaN(targetScore[i])) {
                assignmentEntity.target = Math.round((Number(targetScore[i]) + Number.EPSILON))
            } else {
                assignmentEntity.target = targetScore[i]
            }
            assignmentInfo.push(assignmentEntity)
            var assignment = new Assignment(assignmentEntity)
            var assignmentRecord = new subjectAssignment({ assignmentId: assignment._id })
            allAssignments.push(assignmentRecord)
            await Subject.updateOne({ "_id": req.body.subjectId }, { "assignments": allAssignments }).lean()
            await assignment.save()
        }
        res.render('subject-detail', { "subjectInfo": subjectInfo, "thiscustomer": customer, "assignmentInfo": assignmentInfo })
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }
}

const getEachSubject = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        const subjectInfo = await Subject.findOne({ "_id": req.params._id }).lean()
        const allAssignments = subjectInfo.assignments
        if (allAssignments.length == 0) { // Currently no assignments for this subject
            var assignmentInfo = [{ "assName": "", "myScore": "", "percentage": "", "target": "" }]
        } else {
            var assignmentInfo = []
            for (var i in allAssignments) {
                var assignmentId = allAssignments[i].assignmentId
                assignmentInfo.push(await Assignment.findOne({ "_id": assignmentId }).lean())
            }
        }
        req.session.subjectId = req.params._id
        res.render('subject-detail', { "subjectInfo": subjectInfo, "thiscustomer": customer, "assignmentInfo": assignmentInfo })
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }
}

const addScore = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        const subjectInfo = await Subject.findOne({ "_id": req.body.subject }).lean()
        var assignList = req.body.assignments.split(",")
        var percentList = req.body.percentages.split(",")
        var scoresList = req.body.scores.split(",")
        var targetsList = req.body.targets.split(",")
        var assLength = assignList.length
        var subjectId = req.body.subject
        var gradeInfo = { assignList, percentList, scoresList, targetsList, assLength, subjectId }

        res.render('subjectPage', { "subjectInfo": subjectInfo, "thiscustomer": customer, "gradeInfo": gradeInfo })
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }
}

const getCalcInfo = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        res.render("intro", { "thiscustomer": customer })
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'error-layout' })
    }
}

// Export the functions
module.exports = {
    saveTargerGrade,
    doCalculation,
    getAddSubject,
    addSubject,
    getEachSubject,
    deleteSubject,
    addScore,
    getCalcInfo
}