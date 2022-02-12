const mongoose = require('mongoose');

var productCategory =new mongoose.Schema({
	name: String,
	details: String,
	isDeleted: {type:Boolean,default:false},
	time_of_creation: {type:Date, required:true, default:Date.now}
});

var myProductCategoryModel = mongoose.model('category', productCategory);
module.exports=myProductCategoryModel;