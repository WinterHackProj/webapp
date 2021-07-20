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

// GET the profile of a customer
const getPortfolio = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    res.render('portfolio', { "thiscustomer": customer })
}

// GET change informaiton page
const changeInfoGet = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    res.render('change-info', { "thiscustomer": customer })
}

// POST change informaiton page
const changeInfoPost = async(req, res) => {
    await Customer.updateOne({ "email": req.session.email }, { "nickName": req.body.nickName}).lean()
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    res.render('changeOutcome', { "message": "Nick name changed.", "thiscustomer": customer })
}

// GET change password 
const changePasswordGet = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    res.render('change-password', { "thiscustomer": customer })
}

// POST change password 
const changePasswordPost = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    var oneCustomer = new Customer();
    var passw = oneCustomer.generateHash(req.body.password2)
    await Customer.findOneAndUpdate({ "email": req.session.email }, { "password": passw }).lean()
    res.render('changeOutcome', { "message": "Password changed.","thiscustomer": customer })
}
module.exports = {
    getIndex,
    getPortfolio,
    changeInfoGet,
    changeInfoPost,
    changePasswordGet,
    changePasswordPost,
}