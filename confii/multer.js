const multer = require("multer")
const crypto = require("crypto")
const path = require("path")

const userImageUpload = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/uploads/userImageUpload')
    },
    filename:function(req,file,cb){
        var fn = `${Date.now()}-${crypto.randomBytes(20).toString("hex")}${path.extname(file.originalname)}`;
       cb(null,fn)
    }
})

const productImageUpload = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, './public/images/uploads/productImageUpload')
    },
    filename:function(req,file,cb){
        var fn = `${Date.now()}-${crypto.randomBytes(20).toString("hex")}${path.extname(file.originalname)}`;
        cb(null,fn)
    }
})

module.exports= {userImageUpload,productImageUpload}