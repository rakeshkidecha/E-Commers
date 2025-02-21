const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    quantity:{
        type:Number,
        default : 1
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const Cart = mongoose.model('Cart',CartSchema);
module.exports = Cart;