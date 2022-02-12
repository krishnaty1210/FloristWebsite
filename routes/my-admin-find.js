var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 

var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({})

router.use(express.static(__dirname+"./public/"));

var jwt = require('jsonwebtoken');

function checkLoginUser(req, res, next) {
  if(req.session.adminName) {
  } else{
    res.redirect('/admin')
  }
next()
}

  router.get('/',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName

        res.render('admin/adminHeader',{title:'Infinity Petals',success:'',loginUser:loginUser})
  })

  router.post('/',checkLoginUser, function(req, res, next){
    var loginUser = req.session.adminName
    var pages;
    var cat;

    var fltrName = req.body.fltrName;
    if(fltrName != '') {
        var fltrParameter = { $and: [{product:fltrName},
        ] } }
    else {
        var fltrParameter = {}
    }

    myProductDetailsModel.find(fltrParameter).exec(function(err,data){
        if(err) throw err
        res.render('admin/my-product-read',{title:'Infinity Petals', prodectRecord:data,pages:pages,loginUser:loginUser })
    })
    
  })

  module.exports = router;