 const {userModel}=require("../models/user.model")
 const jwt=require("jsonwebtoken")
 const bcrypt=require("bcrypt")
 const redisCoz=require("../redis/redis")

 const signup=async(req,res)=>{
   try{
    const {name,email,password}=req.body;
    const isuser=await userModel.findOne({email})
    if(isuser) return res.send("user alreday register")

    const hashedPassword=await bcrypt.hash(password, 8)
    const newUser=new userModel({name,email,password:hashedPassword, city})
    await newUser.save();
    res.status(200).send({msg:"Signup successfully"})
   } catch(error){
    res.status(400).send({msg:error.message})
   }
 }

 const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!isuser) return res.send("please register first")

        const ispass=await bcrypt.compare(password,isuser.password)
        if(!ispass){
            return res.send({msg:"password invalid"})
        }

        const token=await jwt.sign(
            {userID: isuser._id, city:isuser.city},process.env.JWT_secret,{expireIn:"6hr"})
            res.send({msg:"login successful", token})
    } catch(error){
        res.send({msg:error.message})
    }
 };


 const logout=async(req,res)=>{
    try{
     const token=req.headers?.authorization.split(" ")[1]

     if(!token) return res.status(403)
     await redisCoz.set(token, token)
     res.send("logout successful")
    } catch(err){
        res.send(err.message)
    }
 }


 module.exports={login,logout,signup}