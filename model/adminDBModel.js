const mongoose = require('mongoose')

var newAccount = new mongoose.Schema({
    username: {type: String, required: true, index: {unique: true}},
    email: {type: String, required: true, index: {unique: true}},
    password: {type: String, required: true},
    time_of_creation: {type: Date, default: Date.now},
  });

  var newAccountModel = mongoose.model('admin_ids', newAccount);

  module.exports = newAccountModel;
