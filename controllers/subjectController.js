const mongoose = require("mongoose")
// import subject model
const Subject = mongoose.model("Subject")

//save subject target grades
const saveTargerGrade = (req, res) => {
    var subject_code = Object.keys(req.body)[0];
    var target_grade = Object.values(req.body)[0];
    Subject.updateOne(
        { subject_code: { $eq: subject_code } },
        { target: target_grade},
        function (err, docs) {
            if (err) {
              console.log(err)
            }
            else {
              console.log("Updated Docs:", docs);
            }
          }
    )
}

// Export the functions
module.exports = {
    saveTargerGrade
  }
  