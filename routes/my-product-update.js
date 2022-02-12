var express = require('express');
var router = express.Router();

var myProductDetailsModel = require('../model/product');
var myProductCategoryModel = require('../model/category');
var category = myProductCategoryModel.find({ isDeleted : false });
var multer  = require('multer');
var path = require('path');
router.use(express.static(__dirname+"./public/"));

var Storage= multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).any('file');


var jwt = require('jsonwebtoken');

function checkLoginUser(req, res, next) {
  if(req.session.adminName) {
  } else{
    res.redirect('/admin')
  }
next()
}


  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser = req.session.adminName
    var id = req.params.id;

    var catRec;
    category.exec(function(err,catData){
        if(err) throw err
        catRec = catData
    })

    myProductDetailsModel.findById({_id:id}).exec(function(err,data){
        if(err) throw err;
        res.render('admin/edit_product', { title:'Infinity Petals',success:'', productRecord:data,loginUser:loginUser,categoryRecord:catRec});
    })
  
  });


  router.post('/:id',checkLoginUser,upload, function(req, res, next) {
    var loginUser = req.session.adminName
    var id = req.params.id;

    var catRec;
    category.exec(function(err,catData){
        if(err) throw err
        catRec = catData
    })

    var filename = req.files[0] && req.files[0].filename ? req.files[0].filename : '';
    var productdetails = myProductDetailsModel.findByIdAndUpdate(id,{
        product: req.body.product,
        details:req.body.productdetails,
        price: req.body.price,
        category:req.body.category,
        images : [filename]
    })

    /*console.log("test1");
    productdetails.images = [];
    for(var i = 0; i < req.files.length; i++) {
         console.log(req.files.length);
         console.log("req.files[i]"+req.files[i]);
         console.log("req.files[i].filename"+req.files[i].filename);
         productdetails.images[i] = req.files[i] && req.files[i].filename ? req.files[i].filename : '';
      }*/

    productdetails.exec(function(err){
        if(err) throw err;
    myProductDetailsModel.findById({_id:id}).exec(function(err,data){
        if(err) throw err;
        res.render('admin/edit_product', { title:'Infinity Petals',success:'', productRecord:data,loginUser:loginUser,categoryRecord:catRec, success:'Updated Successfully'});
    })
    })

  });



  module.exports = router;