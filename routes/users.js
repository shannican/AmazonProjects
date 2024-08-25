const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/stolen")
.then(function(){
  console.log("connected to server")
})

var userSchema=mongoose.Schema({
  // username:String,
  fname:String,
  lname:String,
  email:String,
  contact:Number,
  password:String,
  age:Number,
  birth:String,
  // seller:Boolean,
  gstin:Number,
  dpimage:{
    type:String,
    default:'default.png'
  },
  // pic:String,
  isSeller: {
    type: Boolean,
    default:true
  },
  products:{
    type: Array,
    ref: "product"
  },
  verify:{
    type:String,
    default:'false'
  },
  otp:{
    type:String,
    default:"",
  },
whishlist:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"product",
    default:false,
  }
],
cart:[
  {
  type:mongoose.Schema.Types.ObjectId,
  ref:"product"
}
],
  address: String,
  email: String,
  proffession:String,
})


userSchema.plugin(passportLocalMongoose,{usernameField:'email'})

module.exports = mongoose.model("user",userSchema);
