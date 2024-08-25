var express = require('express');
var passport  = require('passport');
var router = express.Router();
var userModel = require('./users');
var localStrategy = require('passport-local');
const { response } = require('express');
const { update } = require('./users');
const confii = require('../confii/multer')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const productModel = require('./product')
const products = require('./product');
const nodemailer = require('../nodemailer')
var Razorpay = require('razorpay')
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// var GoogleStrategy = require('passport-google-oidc');

var instance = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});
// const app = require('../app');
passport.use(new localStrategy(userModel.authenticate()))
passport.use(userModel.createStrategy());

const userImageUpload = multer({storage:confii.userImageUpload})
const productImageUpload = multer({storage:confii.productImageUpload})

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login');
});

router.post('/upload',isLoggedIn, userImageUpload.single("dpimage"), async function(req,res){
  let user = await userModel.findOne({email:req.user.email})
  user.dpimage = req.file.filename
  await user.save()
  res.redirect('/profile')
})

router.get('/profile',userImageUpload.single("dpimage"),productImageUpload.array("pic",5),isLoggedIn,async function(req,res){
  let loggedInUser = await userModel.findOne({email:req.session.passport.user}).populate('products');  
  let allprods = await productModel.find()
  console.log(loggedInUser.products)
  res.render('profile',{allprods,products : loggedInUser.products,loggedInUser,data:req.user})
})

router.get('/login',isRedirect, function(req,res){
  res.render('login')
})
router.get('/register',function(req,res){
  res.render('register')
})
router.post('/login',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/register'
}));

router.post('/register',function(req,res){
  var boolean = Boolean(req.body.isSeller);
  console.log(boolean)
  var newUser = new userModel({
  fname:req.body.fname,
  lname:req.body.lname,
  email:req.body.email,
  contact:req.body.contact,
  isSeller:boolean,
 })
 userModel.register(newUser,req.body.password)
 .then(function(){
  passport.authenticate('local')(req,res,function(){
    res.redirect('/profile')
 })
 }).catch(function(error){
  res.send(error);
 })
})

router.get('/viewprofile',userImageUpload.single("dpimage"),isLoggedIn, function(req,res){
  res.render('viewprofile',{data:req.user})
})
router.post('/updateProfile/:iddd',isLoggedIn, userImageUpload.single('dpimage'),async function(req,res){
  let updateuser = await userModel.findOne({email:req.session.passport.user})
  updateuser.dpimage = req.file.filename;
  const newuser = await updateuser.save()
  res.redirect('/viewprofile')
  console.log(updateuser)
})
router.post('/update/:idd',isLoggedIn,async function(req,res){
  await userModel.findByIdAndUpdate(req.params.idd, req.body);
  res.redirect('/viewprofile')
})
router.get('/verified',isLoggedIn,async function(req,res){
  res.render('verified',{user:req.user})
})
router.post('/verified',isLoggedIn,async function(req,res){
  let user = await userModel.findOne({email:req.session.passport.user})
  if(user.isSeller){
    user.gstin = req.body.gstin,
    user.address = req.body.address,
    user.fname=req.body.fname,
    user.lname=req.body.lname,
    user.age=req.body.age;
    user.birth=req.body.birth;
    user.proffession=req.body.proffession;
    user.contact = req.body.contact;
    user.gstin = req.body.gstin;
    user.address = req.body.address;
    user.verify='true'
    user.save()
    res.redirect('/profile')
  }
})
router.get('/recentcreate',isLoggedIn, async function(req,res){
  let user = await req.user
  let product = await productModel.find()
  if(user.product){
    res.render('profile')
  }
})

router.get('/allproduct',productImageUpload.array("pic",5), isLoggedIn, async function(req,res){
  let loggedInUser = await userModel.findOne({email:req.session.passport.user})
  let allprods = await productModel.find()
  res.render('allproduct',{allprods,products : loggedInUser.products,loggedInUser})
})
router.get('/createproduct',isLoggedIn,productImageUpload.array("pic",5), async function(req,res){
  res.render('createproduct')
})
router.post('/create/products',isLoggedIn,productImageUpload.array("pic",5) ,async function(req,res,next){
  let user = req.user
  // var boolean = Boolean(req.body.productType)
  if(user.isSeller){
    let data={
      sellerid:user._id,
      productname:req.body.productname,
      productType:req.body.productType,
      price:req.body.price,
      pic:req.files.map(elm=>elm.filename),
      desc:req.body.desc,
      discount:req.body.discount,
    }
    let product = await productModel.create(data)
    user.products.push(product._id)
    await user.save();
    res.redirect('/allproduct')
  }else{
    res.send("you do not have vendor's account")
  }
})
router.get('/delete/product/:id',isLoggedIn, async function(req,res){
  const productIndex = req.user.products.findIndex(product => product._id === req.params.id);
  req.user.products.splice(productIndex,1);
  await productModel.findOneAndDelete({_id:req.params.id}).exec();
  await req.user.save();
  res.redirect('/allproduct')
})

router.get('/editproduct/:idd',isLoggedIn,productImageUpload.array('pic',5),async function(req,res){
  let product = await productModel.findOne({_id:req.params.idd})
  res.render('editproduct',{data:product})
})
router.post('/editproduct/product/:idd',isLoggedIn,async function(req,res){
  console.log(">>>>",req.body)
  await productModel.findByIdAndUpdate(req.params.idd,req.body)
  res.redirect('/allproduct')
})
router.post('/editproduct/product/:idd',productImageUpload.array('pic',5),isLoggedIn,async function(req,res){
  let user = req.user
  let product = await productModel.findOneAndUpdate({_id:req.params.idd})
  if(user.products.includes(product._id)){
    product.productname=req.body.productname;
    product.productType=req.body.productType;
    product.price=req.body.price;
    product.desc=req.body.desc;
    product.pic=req.files.map(elm=>elm.filename);
    product.discount=req.body.discount;
    await product.save()
    res.redirect('/allproduct')
  }else{
    res.send("error")
  }
})
router.get('/whishlist', isLoggedIn, async function(req,res){
  let user = await req.user.populate("whishlist");
  console.log(user)
  res.render('whishlist',{user})
})
router.get('/whishlist/:id',async function(req,res){
  let user = req.user;
  if(!user.whishlist.includes(req.params.id) || user.whishlist==false){
    user.cart.pull(req.params.id)
    user.whishlist.push(req.params.id)
    await user.save()
  }else{
    user.whishlist=false
  }
  res.redirect('/whishlist'); 
});


router.get('/removeWhishlist/:id',async function(req,res){
  let user = await req.user
  req.user.whishlist.pull(req.params.id)
  user.cart.push(req.params.id)
  await user.save();
  res.redirect('/whishlist');
});

router.get("/deletecart/:id",isLoggedIn, async function (req, res) {
  let user = req.user
  user.cart.pull(req.params.id)
  await user.save()
  res.redirect("/allproduct")
});

router.get("/cart/:id",isLoggedIn, async function (req, res) {
  let user = await req.user
  if(!user.cart.includes(req.params.id)){
    user.cart.push(req.params.id)
  }
  await user.save()
  res.redirect("/allproduct")
});

router.get("/cart",isLoggedIn, async function (req, res) {
  let user = await req.user.populate("cart");
  let products = user.cart
  res.send(products)
});

router.get('/cloths', isLoggedIn, async function(req,res){
  let user = await req.user;
  let product = await productModel.find({productType:'cloths'})
  res.render('cloths', {product,user})
})
router.get('/electricProduct', isLoggedIn, async function(req,res){
  let user = await req.user
  let product = await productModel.find({productType:'electronic'})
  res.render('electricProduct',{product,user})
})
router.get('/sportsProduct', isLoggedIn, async function(req,res){
  let user = await req.user
  let product = await productModel.find({productType:'sports'})
  res.render('sports',{product,user})
})
router.get('/kitchenProduct', isLoggedIn, async function(req,res){
  let user = await req.user
  let product =  await productModel.find({productType:'kitchen'})
  res.render('kitchenProducts',{product,user})
})
router.get('/books', isLoggedIn, async function(req,res){
  let user = await req.user
  let product =  await productModel.find({productType:'books'})
  res.render('books',{product,user})
})

router.get('/reset/:id/otp/:otp',async function(req,res){
  let user = await userModel.findOne({_id:req.params.id})
  res.render('reset', {user})
})

router.post('/reset/:id', async function(req,res){
  let user = await userModel.findOne({_id:req.params.id})
  if(user){
    user.setPassword(req.body.newpassword, async function(){
      await user.save();
      res.redirect("/login")
    })
  }else{
    res.send("nhi hoga")
  }
})

router.get('/forgot', function(req,res){
  res.render('forgot')
})
router.post('/forgot', async function(req,res,next){
  let user = await userModel.findOne({email: req.body.email})
    if(user){
      crypto.randomBytes(17, async function(err,buff){
        const otpstring = buff.toString("hex")
        user.otp=otpstring;
        await user.save();
        nodemailer(user.email,otpstring,user._id)
        .then(() => {
          console.log("sent mail !");
          res.send("Mail sent!!");
        })
      })
    }else{
      res.send("wrong linked")
    }
})

router.get('/logout',function(req,res,next){
  req.logout(err => {
    if (err) { return next(err); }
    res.redirect('/login');
  }); 
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/login');
  } 
}

function isRedirect(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/profile')
  }else{
    return next();
  }
}
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

router.get('/login/federated/google', passport.authenticate('google'));
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['email','profile']
}, function verify(issuer, profile, cb) {
    console.log(profile)
    userModel.findOne({emails:profile.emails[0].value},(err,User)=>{
      if(err){
        console.log(err)
        return cb(new Error(err))
      }
      if(User){
        return cb(null,User)
      }
      var newUser = new userModel()
      newUser.name = profile.displayName,
      newUser.email = profile.emails[0].value
      newUser.save((err,User)=>{
        if(err) console.log(err)
        return cb(null, User)
      })
    })
}));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/register'
}));

module.exports = router;
  