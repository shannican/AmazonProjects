const mongoose = require('mongoose')
const { array } = require('../confii/multer')
var productSchema = mongoose.Schema({
  name: String,
  // price: String,
  price:{
    type:Number,
    default:"",
  },
  productType:{
    type:String,
    default:"normal",
  },
  sellerid:String,
  desc:String,
  pic:{
    type:Array,
    default:[],
  },
  productname:String,
  discount:{
    type:Number,
    default:"",
  }
})

module.exports = mongoose.model('product', productSchema)
