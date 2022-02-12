var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 

var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({})

var orders_placed_Model = require('../model/buy-product')
var buy = orders_placed_Model.find({}).sort({time_of_creation: -1})

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
   
    buy.skip((perPage * page) - perPage)
    .limit(perPage).populate('user').populate('product').exec(function(err,data){
      if(err) throw err;
      orders_placed_Model.countDocuments({}).exec((err,count)=>{    

        res.render('admin/view-order',{title:'Infinity Petals',orderRecord:data,
        current: page,
        pages: Math.ceil(count / perPage),
        loginUser:loginUser
      });
      
      });
    });
    buy.exec(function(err,data){
    if(err) throw err;
    });
  });

  router.get('/:page',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName

    var perPage = 12;
    var page = req.params.page || 1;
   
    buy.skip((perPage * page) - perPage)
    .limit(perPage).populate('user').populate('product').exec(function(err,data){
      if(err) throw err;
      orders_placed_Model.countDocuments({}).exec((err,count)=>{    
        res.render('admin/view-order',{title:'Infinity Petals',orderRecord:data,
        current: page,
        pages: Math.ceil(count / perPage),
        loginUser:loginUser
      });
      });
    });
    buy.exec(function(err,data){
    if(err) throw err;
    });
  });

  router.get('/delete/:id',checkLoginUser, function(req,res, next){
    var loginUser = req.session.adminName

    var pages;
    orders_placed_Model.findByIdAndDelete({_id:req.params.id}).exec(function(err){
    if(err) throw err
    buy.exec(function(err,data){
      res.redirect('/admin/viewOrder')
    })
    })
  })
  module.exports = router;