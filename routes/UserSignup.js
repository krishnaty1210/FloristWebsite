var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 

var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({})

var newAccountModel = require('../model/userDBModel')
var signup = newAccountModel.find({})

router.use(express.static(__dirname+"./public/"));

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');




function checkEmail(req, res, next){
    var email= req.body.email;
    var checkExitEmail = newAccountModel.findOne({email:email});
    checkExitEmail.exec((err, data)=>{
      if (err) throw err;
      if (data) {
        return res.render('client/userSignup', { title: 'Infinity Petals', msg:"Email Already Exit" });
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
        return res.render('client/userSignup', { title: 'Infinity Petals', msg:"UserName Already Exit" });
      }
      next()
    })
  }
  
  router.get('/',function(req,res, next){
        res.render('client/userSignup',{title:'Infinity Petals',msg:''})
  })

  
  router.post('/',checkUserName,checkEmail, function(req, res, next) {
    var username = req.body.uname;
    var fName = req.body.fName;
    var email = req.body.email;
    var phone = req.body.phone;
    var city = req.body.city;
    var address = req.body.address;
    var password = req.body.password;
    var confpassword = req.body.confpassword;
    
    password = bcrypt.hashSync(req.body.password, 10)
    var signupDetails = new newAccountModel({
      username:username,
      fName:fName,
      email:email,
      phone:phone,
      city:city,
      address:address,
      password:password,
    });

    signupDetails.save((err,doc)=>{
      if (err) throw err;
      res.render('client/userSignup', { title: 'Infinity Petals', msg:'User Register Successfully' });
    });
    
  });
  

  module.exports = router;