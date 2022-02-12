var express = require('express');
var router = express.Router();
var multer  = require('multer')

var myProductCategoryModel = require('../model/category');
var category = myProductCategoryModel.find({}).sort({time_of_creation: -1});

var myProductDetailsModel = require('../model/product');
var product = myProductDetailsModel.find({}).sort({time_of_creation: -1});

var path = require('path');
router.use(express.static(__dirname+"./public/"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage }).single('file')
var bcrypt = require('bcryptjs');
  
  var jwt = require('jsonwebtoken');
  
  function checkLoginUser(req, res, next) {
    if(req.session.adminName) {
    } else{
      res.redirect('/admin')
    }
  next()
  }

  
  router.get('/edit/:id',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName
    var id = req.params.id;
    var getCategory = myProductCategoryModel.findById({_id:id});
    getCategory.exec(function(err,data){
      res.render('admin/edit_category',{title:'Infinity Petals',categoryRecord:data,loginUser:loginUser,success:''})
    })
  })

  router.post('/:id',checkLoginUser,upload, function(req,res, next){
    var loginUser = req.session.adminName
    var id = req.params.id;
    myProductCategoryModel.findByIdAndUpdate(id,{
      name:req.body.categoryName,
      details:req.body.categorydetails
    }).exec(function(err){
      if(err) throw err
  
    var getCategory = myProductCategoryModel.findById({_id:id});
    getCategory.exec(function(err,data){
      res.render('admin/edit_category',{title:'Infinity Petals',categoryRecord:data,loginUser:loginUser,success:'Updated Successfully'})
    })
  })
})

module.exports = router