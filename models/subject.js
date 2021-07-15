// import required dependencies 
const mongoose = require("mongoose")

const subjectAssignmentSchema = new mongoose.Schema({
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
})

// define food Schema
const subjectSchema = new mongoose.Schema({
    subject_code: String,
    subject_name: String,
    credit: String,
    target: String,
    assignments: [subjectAssignmentSchema]
})
const Subject = mongoose.model("Subject", subjectSchema)
const subjectAssignment = mongoose.model("subjectAssignment", subjectAssignmentSchema)
// export schema
module.exports = {Subject, subjectAssignment }