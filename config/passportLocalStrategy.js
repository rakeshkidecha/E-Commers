const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/AdminModel');
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('dotenv').config();

// Admin Login Stategy 
passport.use('adminLogin',new LocalStrategy({usernameField:'email',passReqToCallback:true},async (req,email,password,done)=>{
    const adminData = await Admin.findOne({email:email,status:true});
    if(adminData){
        if(await bcrypt.compare(password,adminData.password)){
            return done(null,adminData);
        }else{
            req.flash('error',"Invalid Password");
            return done(null,false);
        }
    }else{
        req.flash('error',"Invalid Email");
        return done(null,false);
    }
}));

// user Login Stategy 
passport.use('userLogin',new LocalStrategy({usernameField:'email',passReqToCallback:true},async (req,email,password,done)=>{
    const userData = await User.findOne({email:email,status:true});
    if(userData){
        if(await bcrypt.compare(password,userData.password)){
            return done(null,userData);
        }else{
            req.flash('error',"Invalid Password");
            return done(null,false);
        }
    }else{
        req.flash('error',"Invalid Email or Account has been Blocked");
        return done(null,false);
    }
}));

// user google login strategy 
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://e-commers-lvga.onrender.com/auth/google/callback',
},async(accessToken, refreshToken, profile, done)=>{
    const isExistUser = await User.findOne({email:profile.emails[0].value});
    if(isExistUser){
        done(null,isExistUser);
    }else{
        const createUser = await User.create({
            username : profile.displayName,
            email:profile.emails[0].value,
            password: await bcrypt.hash('googlePass',10),
            profileImage: '/uploads/user/profileImage-1740394711331'
        });
        if(createUser){
            done(null,createUser);
        }else{
            done(null,false);
        }
    }
}));

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    const adminData = await Admin.findById(id);
    if(adminData){
        return done(null,adminData);
    }else{
        const userData = await User.findById(id);
        if(userData){
            return done(null,userData);
        }else{
            return done(null,false);
        }
    }
});

passport.setAuthUser = async (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.adminData = req.user;
    }
    next()
};

passport.checkLogin = async(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/admin');
}

passport.checkUserLogin = async(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error',"Please Login First")
    return res.redirect('/userLogin');
}


module.exports = passport;