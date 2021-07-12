// import required dependencies 
const mongoose = require("mongoose")

const assignmentSchema = new mongoose.Schema({
    name: String,
    percentage: Number,
    current_score: Number,
    hurdle: {type: Boolean, default: false}
})

const Assignment = mongoose.model("Assignment", assignmentSchema)

module.exports = Assignment

