var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({ isDeleted : false });

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 
var multer  = require('multer')

var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({})

router.use(express.static(__dirname+"./public/"));


var jwt = require('jsonwebtoken');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage }).single('file')

function checkLoginUser(req, res, next) {
  if(req.session.adminName) {
  } else{
    res.redirect('/admin')
  }
next()
}

router.get("/",checkLoginUser,function(req,res,next){
  var loginUser = req.session.adminName
  category.exec(function(err,data){
    if(err) throw err
    res.render('admin/my-category-read',{title:'Infinity Petals',categoryRecord:data, loginUser:loginUser})
    
  })
})

  router.get('/delete/:id',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName

    myProductCategoryModel.findByIdAndUpdate({_id:req.params.id},{ isDeleted : true }).exec(function(err){
    if(err) throw err
    category.exec(function(err,data){
      res.redirect('/admin/ViewCategory')
    })
    })
  })

  

  module.exports = router;