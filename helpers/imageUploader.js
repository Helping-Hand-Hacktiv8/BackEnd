const multer = require('multer')
const path = require('path')

let storageProfileUser =  multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/users"))
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname +"-" + Date.now() + path.extname(file.originalname))
    }
})

let storagePhotoActivity =  multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,"../public/activities"))
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname +"-" + Date.now() + path.extname(file.originalname))
    }
})

const uploadProfileUser = multer({storage:storageProfileUser}).fields([{name:'profileImg',maxCount:1}])
const uploadPhotoActivity= multer({storage:storagePhotoActivity}).fields([{name:'photoAct',maxCount:1}])

module.exports = {uploadProfileUser,uploadPhotoActivity}