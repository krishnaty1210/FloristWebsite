var express = require('express');
var router = express.Router();
var multer  = require('multer')
var Cart = require('../model/cart');

var myProductCategoryModel = require('../model/category');
var category = myProductCategoryModel.find({}).sort({time_of_creation: -1});
var nodemailer = require("nodemailer");

var myProductDetailsModel = require('../model/product');

var product = myProductDetailsModel.find({ isDeleted : false }).sort({time_of_creation: -1});

var orderModel = require('../model/buy-product')
var order = orderModel.find({})

var userModel = require('../model/userDBModel')
var user = userModel.find({})

var path = require('path');
router.use(express.static(__dirname+"./public/"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage }).single('file')
var bcrypt = require('bcryptjs');
  
  var jwt = require('jsonwebtoken');
  

  function checkLoginUser(req, res, next) {
      if(req.session.adminName) {
      } else{
        res.redirect('/admin')
      }
    next()
  }


  function checkUser(req, res, next) {

      if(req.session.userId){
      } else{
        res.redirect('/login')
      }
    next()
  }

/* GET home page. */
router.get('/', function(req, res, next) {
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  

  myProductDetailsModel.find({ isDeleted : false }).sort({time_of_creation:-1}).limit(5).exec(function(err,productData){
    if (err) throw err
  category.exec(function(err, data){
    if(err) throw err
    res.render('index',{title:'Infinity Petals', categoryRecord:data ,loginUserInfo:loginUser, latestProduct: productData,userData:userdata})
  })
})

});


// router.get('/about-us', function(req, res, next) {
//   var loginUser = req.session.userId
//   var userdata
//   userModel.find({_id:loginUser}).exec(function(err,data){
//     if(err) throw err
//     userdata = data
//   })

//   category.exec(function(err,data){
//     res.render('client/aboutus',{title:'Infinity Petals',loginUserInfo:loginUser,categoryRecord:data,userData:userdata})

//   })
// });



router.get('/action-button', function(req, res, next) {
 
    res.render('client/action_button',{title:'Infinity Petals',})

});


router.get('/Order/Completed', function(req, res, next) {
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  product.limit(10).exec(function(err,productData){
    if(err) throw err
 

  category.exec(function(err,data){
    res.render('client/finishedOrder',{title:'Infinity Petals',loginUserInfo:loginUser,categoryRecord:data,productRecord:productData,userData:userdata})

  })
})
});


router.get('/adminHeader',checkLoginUser, function(req, res, next) {
  var loginUser = req.session.adminName

  res.render('admin/adminHeader',{title:'Infinity Petals',loginUser:loginUser})
});


router.get('/header', function(req, res, next) {
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

 category.exec(function(err, data){
    if(err) throw err
    res.render('client/header',{title:'Infinity Petals', categoryRecord:data,loginUserInfo:loginUser,userData:userdata})
  })
});

router.get('/Brands/:name', function(req, res, next) {
  var pages;
  var categoryData;
  
  category.exec(function(err, data){
    if(err) throw err;
    categoryData=data
  })

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })
  console.log('1');
  myProductDetailsModel.find({category:req.params.name}).sort({time_of_creation: -1}).exec(function(err, data){
     if(err) throw err
     res.render('client/view-product',{title:'Infinity Petals',
      prodectRecord:data,
      categoryRecord:categoryData,
      pages:pages,
      userData:userdata
    })
   })
 });


router.get('/footer', function(req,res, next){
  var loginUser = req.session.userId
  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  category.exec(function(err,data){
    res.render('client/footer',{title:'Infinity Petals',categoryRecord:data,loginUserInfo:loginUser,userData:userdata})
  })
})

router.get('/brands/:name', function(req,res, next){
  var loginUser = req.session.userId
  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })
  // var mytemp_details = myProductDetailsModel.find({isDeleted : false}).exec();
  
  console.log('2');
  myProductDetailsModel.find({brand:req.params.name}).exec(function(err,data){
    res.render('client/view-product',{title:'Infinity Petals',productRecord:data,loginUserInfo:loginUser, userData:userdata})
  })
})



router.get('/follow', function(req,res, next){
  res.render('follow',{title:'Infinity Petals',})
})


router.get('/latestProduct', function(req,res, next){
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })
  console.log('3');
  myProductDetailsModel.find({isDeleted : false}).sort({time_of_creation:-1}).limit(5).exec(function(err,data){
    if (err) throw err
    res.render('client/latestProduct',{title:'Infinity Petals', latestProduct: data,loginUserInfo:loginUser,userData:userdata})
  })
})


router.get('/admin/Brand/:name',checkLoginUser, function(req,res, next){
  var loginUser = req.session.adminName;

  var pages;
  
  // console.log('cdhbhd');
  // console.log(mytemp_details);
  console.log('4');
  myProductDetailsModel.find({category:req.params.name}).sort({time_of_creation: -1}).exec(function(err,data){
    if (err) throw err
    
    res.render('admin/my-product-read',{title:'Infinity Petals', 
    prodectRecord: data,
    pages:pages,
    loginUser:loginUser
    })
  })
})


router.get('/view-category', function(req,res, next){
  var loginUser = req.session.userId
  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  category.exec(function(err, data){
    if(err) throw err
    console.log(data)
    res.render('client/view-category',{title:'Infinity Petals', categoryRecord:data,loginUserInfo:loginUser,userData:userdata})
  })
})



router.get('/view-product', function(req,res, next){
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })
  var perPage = 12;
  var page = page || 1;
  var categoryData;

  category.exec(function(err, data){
    if(err) throw err
    categoryData=data;
  })

  product.skip((perPage * page) - perPage)
  .limit(perPage).exec(function(err,data){
    if(err) throw err;
    console.log('5');
    myProductDetailsModel.countDocuments({}).exec((err,count)=>{    
      res.render('client/view-product',{title:'Infinity Petals', 
      loginUserInfo:loginUser,
      prodectRecord: data, 
      categoryRecord:categoryData,
      userData:userdata,
      current: page,
      pages: Math.ceil(count / perPage) 
    });
    });
  });
  product.exec(function(err,data){
  if(err) throw err;
  });
});

router.get('/view-product/:page', function(req,res, next){
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  var perPage = 12;
  var page =req.params.page || 1;
  var categoryData;

  category.exec(function(err, data){
    if(err) throw err
    categoryData=data;
  })

  product.skip((perPage * page) - perPage)
  .limit(perPage).exec(function(err,data){
    if(err) throw err;
    console.log('6');
    myProductDetailsModel.countDocuments({}).exec((err,count)=>{    
      res.render('client/view-product',{title:'Infinity Petals',
      loginUserInfo:loginUser,
      prodectRecord: data, 
      categoryRecord:categoryData,
      userData:userdata,
      current: page,
      pages: Math.ceil(count / perPage) 
    });
    });
  });
  product.exec(function(err,data){
  if(err) throw err;
  });
});

router.get('/Brand/:name', function(req,res, next){
  var loginUser = req.session.userId
  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  var pages;
  category.exec(function(err, categoryData){
    if(err) throw err
    console.log('77777');
    
    
  myProductDetailsModel.find({isDeleted : false, category:req.params.name}).sort({time_of_creation: -1}).exec(function(err,data){
    if (err) throw err
    res.render('client/view-product',{title:'Infinity Petals', 
    loginUserInfo:loginUser,
    prodectRecord: data, 
    categoryRecord:categoryData,
    pages:pages,
    userData:userdata
    })
  })
})

})


router.get('/productDetails/:id', function(req,res, next){
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  category.exec(function(err, categoryData){
    if(err) throw err
    console.log('8');
  myProductDetailsModel.find({_id:req.params.id}).exec(function(err,data){
    if (err) throw err
    res.render('client/productDetails',{title:'Infinity Petals',
    loginUserInfo:loginUser,
     prodectRecord: data,
      categoryRecord:categoryData,
      userData:userdata
    })

    })
  })
})


    
router.get('/autocompleteSearch/', function(req, res, next) {

  var regex= new RegExp(req.query["term"],'i');
  console.log('9');
  var productFilter =myProductDetailsModel.find({brand:regex},{'brand':1}).sort({"time_of_creation":-1}).limit(20);
  productFilter.exec(function(err,data){

var result=[];
if(!err){
   if(data && data.length && data.length>0){
     data.forEach(user=>{
       let obj={
         id:user._id,
         label: user.brand
       };
       result.push(obj);
     });
   }
   res.jsonp(result);
  }
  });
});


/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
      user: "", // your emain address
      pass: "" // your password
  }
});

/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

// app.get('/',function(req,res){
//   res.sendfile('index.html');
// });
router.get('/send',function(req,res){
  var mailOptions={
    from: "Mobile Shop <Mobile@test.com>", // sender address
      to : req.query.to,
      subject : "Thank you for shopping with us!",
      // text : " Our agent contacr you soon "+ req.query.text,
      html: '<h1>Thanks for Shopping!</h1><p>Our call agent will contact you in few hours for order confirmation</p><h4>Order Details</h4>'+ req.query.text +'<p>For more Shopping <a href="https://ecommerce-dem0.herokuapp.com/"> click me </a></p>'
    }
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response){
   if(error){
          console.log(error);
      res.end("error");
   }else{
          console.log("Message sent: " + response.message);
      res.end("sent");
       }
});
});

//================== cart =================
router.get('/buy-product/:id', function(req, res, next) {
  var loginUser = req.session.userId

  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  myProductDetailsModel.findOne({ _id: productId }, function (err, data) {
    cart.add(data, productId);
    req.session.cart = cart;
    res.redirect('/checkout');
  });
  
});

router.get('/add/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  myProductDetailsModel.findOne({ _id: productId }, function (err, data) {
    cart.add(data, productId);
    req.session.cart = cart;
    res.redirect('/cart');
  });
  
});

router.get('/cart', function(req, res, next) {
  var loginUser = req.session.userId

  userModel.find({_id:loginUser}).exec(function(err,userdata){
    if(err) throw err
  

  category.exec(function(err, data){
    if(err) throw err;

    if (!req.session.cart) {
    return res.render('client/cart', {title: 'Infinity Petals',categoryRecord: data, products: '',loginUserInfo:loginUser,userData:userdata});
  }

  var cart = new Cart(req.session.cart);
  console.log("CART ITEMS"+JSON.stringify(cart.itemsAll()))
  res.render('client/cart', {title: 'Infinity Petals',categoryRecord: data, products: cart.itemsAll(), totalPrice: cart.totalPrice,loginUserInfo:loginUser, userData:userdata});
});
})
})

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.remove(productId);
  req.session.cart = cart;
  res.redirect('/cart');
});

router.get('/reduce/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceQuantity(productId);
  req.session.cart = cart;    
  res.redirect('/cart');
}); 

router.get('/increment/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.addOneQuantity(productId);
  req.session.cart = cart;    
  res.redirect('/cart');
}); 

//================== checkout ===================
router.get('/checkout',checkUser, function(req, res,next){
  var loginUser = req.session.userId
  var cart = new Cart(req.session.cart);

  userModel.find({_id:loginUser}).exec(function(err,userdata){
    if(err) throw err

  var catRec
  category.exec(function(err,data){
    if(err) throw err;
    catRec = data
  })

  userModel.find({_id:loginUser}).exec(function(err, data){
    if(err) throw err
    res.render('client/checkout',{title:'Infinity Petals',userRecord:data,products: cart.itemsAll(), categoryRecord:catRec,totalPrice: cart.totalPrice,loginUserInfo:loginUser, userData:userdata})
  })
})

router.post('/edit-orderInfo/:id', function(req, res, next){
  var profileId = req.params.id;
  userModel.findByIdAndUpdate(profileId,{
    phone: req.body.phone,
    city: req.body.city,
    address: req.body.address
  }).exec(function(err){
      if(err) throw err;
      res.redirect('/checkout/')
})
})
  
})

//================== update order status ==================
router.post('/admin/viewOrder/:id',checkLoginUser, function(req, res, next){
  var statusId = req.params.id;
  orderModel.findByIdAndUpdate(statusId,{
    status: req.body.UpdateStatus
  }).exec(function(err){
      if(err) throw err;
      res.redirect('/admin/viewOrder')
})
})


//==================user profile======================

router.get('/user-Profile/:id',function(req,res, next){
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

category.exec(function(err, catdata){
  if(err) throw err


  userModel.find({_id:req.params.id}).exec(function(err,data){
    if(err) throw err
    res.render('client/userProfile',{title:'Infinity Petals',userRecord:data,categoryRecord:catdata,loginUserInfo:loginUser,userData:userdata})
  })
})

})

//================== update userProfile ==================
router.post('/edit-profile/:id', function(req, res, next){
  var profileId = req.params.id;
  userModel.findByIdAndUpdate(profileId,{
    fName: req.body.fname,
    phone: req.body.phone,
    city: req.body.city,
    address: req.body.address
  }).exec(function(err){
      if(err) throw err;
      res.redirect('/user-Profile/'+profileId)
})
})

//=============== user orders ================
router.get('/my-order',function(req,res,next){
  var loginUser = req.session.userId

  var userdata
  userModel.find({_id:loginUser}).exec(function(err,data){
    if(err) throw err
    userdata = data
  })

  category.exec(function(err,catdata){
    if(err) throw err
 

  orderModel.find({user:loginUser}).populate('product').exec(function(err,data){
    if(err) throw err
    console.log('user order'+data)
    res.render('client/userOrder',{title:'Infinity Petals',userOrder:data,categoryRecord:catdata,loginUserInfo:loginUser, userData:userdata})
  })
})
})

// ============admin logout ==============
router.get('/logout',checkLoginUser,function(req, res, next) {
  req.session.destroy(function(err){
    if(err) throw err
      res.redirect('/admin')
  })
});

//=============== user logout
router.get('/Userlogout',function(req, res, next) {
  req.session.destroy(function(err){
    if(err) throw err
      res.redirect('/')
  })
});

module.exports = router;
