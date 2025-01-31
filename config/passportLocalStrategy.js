const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('../models/AdminModel');
const bcrypt = require('bcrypt');

passport.use('adminLogin',new LocalStrategy({usernameField:'email'},async (email,password,done)=>{
    console.log(email,password);
    const adminData = await Admin.findOne({email:email,status:true});
    if(adminData){
        if(await bcrypt.compare(password,adminData.password)){
            return done(null,adminData);
        }else{
            return done(null,false);
        }
    }else{
        return done(null,false);
    }
}));

passport.serializeUser((user,done)=>{
    console.log("serialized")
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    const adminData = await Admin.findById(id);
    if(adminData){
        return done(null,adminData);
    }else{
        return done(null,false);
    }
});

passport.setAuthUser = async (req,res,next)=>{
    if(req.isAuthenticated()){
        res.locals.adminData = req.user;
    }
    next()
}