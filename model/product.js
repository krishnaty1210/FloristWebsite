const mongoose = require('mongoose');

var myProductDetails =new mongoose.Schema({

    product: {type:String, required:true},
    details: String,
    price: {type:Number, required:true},
    images: [String],
    category: String,
    isDeleted: {type:Boolean,default:false},
    time_of_creation: {type:Date, required:true, default:Date.now}

});

var myProductDetailsModel = mongoose.model('product', myProductDetails);
module.exports=myProductDetailsModel;