// import required dependencies 
const mongoose = require("mongoose")
const bcrypt = require('bcrypt-nodejs')

const customerSubjectSchema = new mongoose.Schema({
    SubjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
})
// schema of customer
const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: String,
    nickName: String,
    subjects: [customerSubjectSchema]
})



customerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// compile the Schemas into Models
const Customer = mongoose.model("Customer", customerSchema)
const CustomerSubject = mongoose.model("CustomerSubject", customerSubjectSchema)
// export schema
module.exports = { Customer, CustomerSubject }