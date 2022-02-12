var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 

var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({})

var newAccountModel = require('../model/adminDBModel')
var signup = newAccountModel.find({})

router.use(express.static(__dirname+"./public/"));


var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

function checkLoginUser(req, res, next) {
  if(req.session.adminName) {
  } else{
    res.redirect('/admin')
  }
next()
}


function checkEmail(req, res, next){
    var email= req.body.email;
    var checkExitEmail = newAccountModel.findOne({email:email});
    checkExitEmail.exec((err, data)=>{
      if (err) throw err;
      if (data) {
        return res.render('admin/signup-admin', { title: 'Infinity Petals', msg:"Email Already Exists" });
      }
      next()
    })
  }
  
  function checkUserName(req, res, next){
    var userName= req.body.uname;
    var checkExitUserName = newAccountModel.findOne({username:userName});
    checkExitUserName.exec((err, data)=>{
      if (err) throw err;
      if (data) {
        return res.render('admin/signup-admin', { title: 'Infinity Petals', msg:"UserName Already Exists" });
      }
      next()
    })
  }
  

  router.get('/',checkLoginUser, function(req,res, next){
        res.render('admin/signup-admin',{title:'Infinity Petals',msg:''})
  })

  router.post('/',checkLoginUser, checkUserName,checkEmail, function(req, res, next) {
    var username = req.body.uname;
    var email = req.body.email;
    var password = req.body.password;
    var confpassword = req.body.confpassword;
  
    if(password != confpassword) {
      res.render('admin/signup-admin', { title: 'Infinity Petals', msg:'Password Not Matched!' });
    }
    else {
      password = bcrypt.hashSync(req.body.password, 10)
      var signupDetails = new newAccountModel({
        username:username,
        email:email,
        password:password,
      });
  
      signupDetails.save((err,doc)=>{
        if (err) throw err;
        res.render('admin/signup-admin', { title: 'Infinity Petals', msg:'User Registered Successfully' });
      });
    }
    
  });
  

  module.exports = router;