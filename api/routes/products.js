const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./uploads");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
const fileFilter = (req,file,cb)=>{
    //reject a file
    console.log(file);
    if(file.mimetype === 'image/jpeg'  || file.mimetype === 'image/png'){
        cb(null,true);
    }else{
        cb(new Error('Invalid image format'),false);
    }
};
//const upload = multer({dest: 'uploads/'}); //store file in uploads this is correct if you want to change name then use below
const upload = multer({
    storage:Storage, 
    limits:{
        fileSize:1024*1024*5
    },
    fileFilter:fileFilter
});

router.get('/',ProductsController.products_get_all);

router.post('/',checkAuth,upload.single('productImage'),ProductsController.products_create_product);

router.get('/:productId',ProductsController.products_get_product);

router.patch('/:productId',checkAuth,ProductsController.products_update_product);

router.delete('/:productId',checkAuth,ProductsController.products_delete_product);

module.exports = router;