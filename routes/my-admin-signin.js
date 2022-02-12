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

var bcrypt = require('bcryptjs');

  var jwt = require('jsonwebtoken');
  
  router.get('/', function(req,res, next){
    var loginUser = localStorage.getItem('loginUser')
    if(loginUser) {
      res.redirect('/admin/dashboard')
    }
    else {
      res.render('admin/login-admin',{title:'Infinity Petals',msg:''})
    }
  })


  router.post('/', function(req, res, next) {
    var userName = req.body.uname;
    var password = req.body.password
    var checkUser = newAccountModel.findOne({username:userName});
    checkUser.exec((err, data)=>{
      if(data == null) {
        res.render('admin/login-admin', { title: 'Infinity Petals', msg:"Invalid Admin UserName and Password." });
      } else {
        if (err) throw err
      var getUserId = data._id
      var getPassword = data.password;
      if (bcrypt.compareSync(password, getPassword)) {
        var token = jwt.sign({ userId: getUserId }, 'loginToken');
        req.session.adminName = userName
  
        res.redirect('/admin/dashboard');
      }
      else {
        res.render('admin/login-admin', { title: 'Infinity Petals', msg:"Invalid Admin UserName and Password."});
      }
    }})
  });

  

  module.exports = router;