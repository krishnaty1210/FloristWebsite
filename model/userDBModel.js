const mongoose = require('mongoose')

var newAccount = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    fName: {type:String, required:true},
    email: {type: String, required: true, index: {unique: true}},
    phone: {type: String, required:true},
    city: {type:String, required:true},
    address:{type:String, required:true},
    password: {type: String, required: true},
    time_of_creation: {type: Date, default: Date.now},
  });

  var newAccountModel = mongoose.model('User_Ids', newAccount);

  module.exports = newAccountModel;