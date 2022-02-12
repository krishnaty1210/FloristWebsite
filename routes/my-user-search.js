var express = require('express');
var router = express.Router();

var myProductCategoryModel = require('../model/category');
var category =myProductCategoryModel.find({ isDeleted : false });

var myProductDetailsModel = require('../model/product');
var product =myProductDetailsModel.find({ isDeleted : false }); 



var adminContactModel = require('../model/usercontactform')
var contact = adminContactModel.find({})

router.use(express.static(__dirname+"./public/"));

  router.get('/', function(req,res, next){
    var loginUser = localStorage.getItem('loginUserInfo')

      category.exec(function(err, data){
        if (err) throw err
        res.render('client/header',{title:'Infinity Petals',categoryRecord:data,loginUserInfo:loginUser, success:''})
      })
  })



  router.post('/', function(req, res, next){
    var loginUser = req.session.userId

    var pages;

     var catRec;
    category.exec(function(err,catData){
        if(err) throw err
        //catRec = catData

    var fltrName = req.body.fltrName;
    var reg = ".*" + fltrName + ".*";
    if(fltrName != '') {
        var fltrParameter = { $and: [{product:{$regex : reg , $options : "i"}},
        ] } }
    else {
        var fltrParameter = {}
    }

    var perPage = 12;
    var page =req.params.page || 1;

    myProductDetailsModel.find(fltrParameter).exec(function(err,data){
        if(err) throw err
        pages = 1;
        res.render('client/view-product',{title:'Infinity Petals', prodectRecord:data,pages:pages,categoryRecord:catData,current: 1,loginUserInfo:loginUser })
    })
    })
  })


  module.exports = router;