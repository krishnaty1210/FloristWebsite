const mongoose = require('mongoose')

var usercontactformDetails =new mongoose.Schema({
	name: {type: String, required:true},
    email: {type: String, required:true},
    subject:{type: String, required:true},
    message: {type: String, required:true},
    mobile: {type: String, required:true},
    counter: {type: Number,default:0},
    time_of_creation: {type: Date, default: Date.now},
});

var adminContactModel = mongoose.model('contact', usercontactformDetails);

module.exports=adminContactModel;