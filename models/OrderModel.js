const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    cartIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    }],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    address :{
        type:String,
        required:true
    },
    country :{
        type:String,
        required:true
    },
    state :{
        type:String,
        required:true
    },
    city :{
        type:String,
        required:true
    },
    pinCode :{
        type:Number,
        required:true
    },
    paymentStatus:{
        type:Boolean,
        default:false
    },
    status:{
        type:String,
        default:'pandding'
    }
},{timestamps:true})

const Order = mongoose.model('Order',OrderSchema);
module.exports = Order;