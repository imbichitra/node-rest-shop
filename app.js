const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

const db = "mongodb+srv://bichi:"+ process.env.MONGO_ATLAS_PW +"@cluster0-unoem.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(db,{useNewUrlParser: true});

app.use(cors()) ;
app.use(morgan('dev')); //morgan is used for display in logs
mongoose.Promise = global.Promise;

app.use('/uploads',express.static('uploads')); //to access the image gloabaly ex:- localhost:3000/imagename.png
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//bichitra@1994 mogodb password
//bichi userd id and password db

/*nodemon is used to auto restart the server*/
// Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app;