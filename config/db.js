const mongoose = require('mongoose');
const env = require('dotenv').config();

// offline Uri 
mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce');

// online Uri
// mongoose.connect(process.env.MONGODB_CONNECT_URI);

const db  = mongoose.connection;

db.once('open',err=>console.log(err?err:"Data Base Connected Successfully"));

module.exports = db;