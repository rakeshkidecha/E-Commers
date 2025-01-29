const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce');

const db  = mongoose.connection;

db.once('open',err=>console.log(err?err:"Data Base Connected Successfully"));

module.exports = db;