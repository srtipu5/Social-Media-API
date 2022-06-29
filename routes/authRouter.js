const router = require('express').Router();
const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');

// user register
router.post('/register',async(req,res)=>{
    try{   
        // password hash
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);

        // create new user 
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        })

        await user.save();

        // give response to server
        res.status(200).json({
            data: user,
            message: "User has been successfully saved."
        });

    }catch(err){
        res.status(500).json(err);
    }
    
})

// user login
router.post('/login',async(req,res)=>{
    try{
        // search user from database   
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).json({
                message: "User not found."
            });
        }else{
              // compare password with hashPassword 
              const checkPassword = await bcrypt.compare(req.body.password,user.password);
              
              if(!checkPassword){
                res.status(400).json({
                    message: "Email or password worng."
                });
              }else{
                res.status(200).json({
                    message: "User has been successfuly logged in."
                });
              }
        }

    }catch(err){
        res.status(500).json(err);
    }
    
})

module.exports = router;