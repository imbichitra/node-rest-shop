const Order = require('../models/orders');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.orders_get_all = (req,res,next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product','name') //optional populate the product
    .exec()
    .then(result =>{
        res.status(200).json({
            count:result.length,
            orders : result.map(result =>{
                return{
                    _id:result._id,
                    product:result.product,
                    quantity:result.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/'+result._id
                    }
                }
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
}

exports.orders_create_order = (req,res,next)=>{
    Product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return res.status(404).json({
                message:'product not found'
            });
        }
        console.log("hello");
        const order = new Order({
            _id:mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
       return order.save()
    })
    .then(result=>{
        res.status(201).json({
            message : 'Order stored',
            createdProduct:{
                _id:result._id,
                product:result.product,
                quantity:result.quantity
            },
            request:{
                 type:'GET',
                 url:'http://localhost:3000/orders/'+result._id
             }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
}

exports.orders_get_order = (req,res,next) => {
    Order.findById(req.params.orderId)
    .select('quantity _id product')
    .populate('product')
    .exec()
    .then(order=>{
        if(!order){
            return res.status(404).json({
                message:"Order not found"
            });
        }
      res.status(200).json({
          orderId: order
      });
    })
    .catch(err=>{
      res.status(500).json({
          error:err
      })
    }) 
}

exports.oders_delete_order = (req,res,next)=>{
    Order.remove({_id:req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Order Deleted!'
        });
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
}