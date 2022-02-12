var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 

var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({}).sort({time_of_creation: -1})

var orders_placed_Model = require('../model/buy-product')
var buy = orders_placed_Model.find({})

var accountModel = require('../model/adminDBModel')
var account = accountModel.find({})
router.use(express.static(__dirname+"./public/"));


var jwt = require('jsonwebtoken');

function checkLoginUser(req, res, next) {
  if(req.session.adminName) {
  } else{
    res.redirect('/admin')
  }
next()
}

router.get('/',checkLoginUser,function(req,res,next){
  var loginUser = req.session.adminName

  account.exec(function(err,data){
    if(err) throw err
    res.render('admin/view-admin-account',{title:'Infinity Petals',adminAcountRecord:data,loginUser:loginUser })
  })
})


  router.get('/delete/:id',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName

    accountModel.findByIdAndDelete({_id:req.params.id}).exec(function(err){
    if(err) throw err
    account.exec(function(err,data){
      res.redirect('/admin/viewAccount')
    })
    })
  })

  module.exports = router;