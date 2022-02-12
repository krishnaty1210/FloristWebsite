var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 

var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({})

var orederModel = require('../model/buy-product')
var order = orederModel.find({})

var accountModel = require('../model/adminDBModel')
var accout = accountModel.find({})

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
      var loginadmin = req.session.adminName

      myProductCategoryModel.countDocuments({ isDeleted : false }).exec(function(err,countCategory){
            if(err) throw err
            myProductDetailsModel.countDocuments({ isDeleted : false }).exec(function(err,countProduct){
                  if(err) throw err
                  orederModel.countDocuments({}).exec(function(err,countOrder){
                        if(err) throw err
                        adminContactModel.countDocuments({}).exec(function(err,countContact){
                              if(err) throw err
                              accountModel.countDocuments({}).exec(function(err,countSignup){
                                if (err) throw err
                                res.render('admin/adminDashboard',{title:'Infinity Petals',
                                countCategory:countCategory,
                                countProduct:countProduct,
                                countOrder:countOrder,
                                countContact:countContact,
                                countSignup:countSignup,
                                loginUser:loginadmin,
                              })
                            })
                        })
                  })
            })
      })
  })

  module.exports = router;