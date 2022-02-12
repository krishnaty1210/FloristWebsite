var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/infinityPetalsDB', {useNewUrlParser: true, useUnifiedTopology: true});


var myHomepageRouter = require('./routes/index');
var signup = require('./routes/UserSignup');
var login = require('./routes/userLogin');
var adminRegisterRouter = require('./routes/adminDBModel');
var loginAdminsRouter = require('./routes/my-admin-signin');
var productsBuyRouter = require('./routes/buy-product');
var myUsersPageRouter = require('./routes/users');
var clientSearchRouter = require('./routes/my-user-search');
var categoryAddRouter = require('./routes/create-my-category');
var productsAddRouter = require('./routes/create-my-product');
var adminContactRouter = require('./routes/usercontactform');
var myAdminDashboardRouter = require('./routes/my-admin-index');
var editAdminsRouter = require('./routes/view-admin-account');
var updateCategoryAdmnRouter = require('./routes/my-category-update');
var categoryUpdateAdmnRouter = require('./routes/my-product-update');
var editCategoriesAdminRouter = require('./routes/my-category-read');
var editProductsAdminRouter = require('./routes/my-product-read');
var editOrdersAdminRouter = require('./routes/view-order');
var contactAdminRouter = require('./routes/view-contact');
var adminsSearchRouter = require('./routes/my-admin-find');





var app = express();

const port = process.env.PORT || 3000


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'cartdemo',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use('/', myHomepageRouter);
app.use('/users', myUsersPageRouter);
app.use('/admin/create-my-category',categoryAddRouter)
app.use('/admin/create-my-product',productsAddRouter)
app.use('/contact-us',adminContactRouter)
app.use('/admin/dashboard',myAdminDashboardRouter)
app.use('/buy-product',productsBuyRouter)
app.use('/admin/ViewCategory',editCategoriesAdminRouter)
app.use('/admin/ViewProduct',editProductsAdminRouter)
app.use('/admin/viewOrder',editOrdersAdminRouter)
app.use('/admin/viewContact',contactAdminRouter)
app.use('/search',clientSearchRouter)
app.use('/admin/search',adminsSearchRouter)
app.use('/admin/signup-admin',adminRegisterRouter)
app.use('/admin',loginAdminsRouter)
app.use('/admin/viewAccount',editAdminsRouter)
app.use('/admin/update-category',updateCategoryAdmnRouter)
app.use('/admin/update-product',categoryUpdateAdmnRouter)
app.use('/signup',signup)
app.use('/login',login)




app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, () => {
  console.log(`Server running on port: ${port} `)
})