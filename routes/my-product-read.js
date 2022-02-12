var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({ isDeleted : false }).sort({time_of_creation: -1}); 

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

    var perPage = 12;
    var page = page || 1;
   
    product.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
      if(err) throw err;
      myProductDetailsModel.countDocuments({}).exec((err,count)=>{    
        res.render('admin/my-product-read',{title:'Infinity Petals', 
        prodectRecord: data, 
        current: page,
        pages: Math.ceil(count / perPage),
        loginUser:loginUser
      });
      });
    });
    product.exec(function(err,data){
    if(err) throw err;
    });
  });

  router.get('/delete/:id',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName

    var pages;
    myProductDetailsModel.findByIdAndUpdate({_id:req.params.id},{ isDeleted : true }).exec(function(err){
    if(err) throw err
    product.exec(function(err,data){
      res.redirect('/admin/ViewProduct')
    })
    })
  })
  
  router.get('/:page',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName

    var perPage = 12;
    var page =req.params.page || 1;
  
    product.skip((perPage * page) - perPage)
    .limit(perPage).exec(function(err,data){
      if(err) throw err;
      myProductDetailsModel.countDocuments({ isDeleted : false }).exec((err,count)=>{    
        res.render('admin/my-product-read',{title:'Infinity Petals',
        prodectRecord: data,   
        current: page,
        pages: Math.ceil(count / perPage),
        loginUser:loginUser
      }); 
      });
    });
    product.exec(function(err,data){
    if(err) throw err;
    });
  });
  

  module.exports = router;