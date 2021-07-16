const mongoose = require("mongoose")
// import subject model
const Subject = mongoose.model("Subject")


function checkValidity(scoreObject){
  console.log(scoreObject)
  return 0
}

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
    res.redirect('back')
}

const displayReport = (req, res) => {
  var scoreObject = req.body
  // if (checkValidity(scoreObject) == 0){
  //   console.log('Invalid Input!')
  //   res.redirect('back')
  // }
  // else{
    res.render("reportPage")
  //}
}

// Export the functions
module.exports = {
    saveTargerGrade, displayReport
  }
  