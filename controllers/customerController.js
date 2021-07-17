const subject = require('../models/subject')
const Subject = subject.Subject

const customer = require("../models/customer")
const Customer = customer.Customer

const getIndex = async(req, res) => {
    if (req.session.email) {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        const subjects = customer.subjects
        const subjectOnIndex = []

        for (var i = 0; i < subjects.length; i++) {
            var oneSubject = await Subject.findOne({ "_id": subjects[i].SubjectId }).lean()
            subjectOnIndex.push(oneSubject)
        }
        if (customer === null) {
            res.status(404)
            return res.send('Food not found')
        }
        res.render('index', { "thiscustomer": customer, "subjectOnIndex": subjectOnIndex })
    } else {
        res.render('index')
    }
}

const getPortfolio = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    res.render('portfolio', { "thiscustomer": customer })
}

module.exports = {
    getIndex,
    getPortfolio
}