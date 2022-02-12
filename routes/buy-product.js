var express = require('express');
var router = express.Router();
var Cart = require('../model/cart');
var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({});

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({}); 

var orders_placed_Model = require('../model/buy-product')
var buy = orders_placed_Model.find({})

var userModer = require('../model/userDBModel')
var user = userModer.find({})

var nodemailer = require("nodemailer");


router.use(express.static(__dirname+"./public/"));



  router.post('/', function(req, res, next){   
    var loginUser = req.session.userId
 
    var cat
    category.exec(function(err, data){
      if(err) throw err
      cat= data
    })
    var buyDetails = new orders_placed_Model({

       message:req.body.message,

      })


      var productsIDs = []
      var cart = new Cart(req.session.cart);
      var cartItems= cart.itemsAll();
      for (var i=0; i< cartItems.length; i++){

        productsIDs.push(cartItems[i].item._id)
        buyDetails.amount_nos.push(cartItems[i].quantity)
      }
      
      buyDetails.product = productsIDs
      var loginUser = req.session.userId
      buyDetails.user = loginUser


    buyDetails.save(function(err, data){
      if(err) throw err;
        res.redirect('/Order/Completed')
    })
  })


  module.exports = router;