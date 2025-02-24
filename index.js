const express = require('express');
const path = require('path');
const db = require('./config/db');
const app = express();
const cookieParser = require('cookie-parser');
const env = require('dotenv').config();

const passport = require('passport');
const session = require('express-session');
const passportLocal = require('./config/passportLocalStrategy');

const flash = require('connect-flash');
const flashMassage = require('./config/fleshMassage');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'assets')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use(session({
    name:'user',
    secret:'mysecretkey',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge: 60*60*60*1000
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthUser)

app.use(flash());
app.use(flashMassage.flashMsg);

app.use('/',require('./routes'));

app.listen(process.env.PORT,err=>console.log(err?err:"Server run in http://localhost:"+process.env.PORT))