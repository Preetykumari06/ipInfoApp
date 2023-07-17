const jwt=require("jsonwebtoken")

 const {redisCoz}=require("./redis/redis")

const authentication = async (req,res,next) => {
    try{
        const token=req.headers?.authorization.split(" ")[1]
   
        if(!token) return res.status(401).send({msg: "please login again"})
        const istoken = await jwt.verify(token, process.env.JWT_secret)
        if(!istoken) return res.status(400).send({msg: "authentication failed"}) 
        const isTokenBlacklist=await redisCoz.get(token)
        if(isTokenBlacklist){
            res.status(400).send({msg: "token blacklisted"})
            return;
        }
  
        req.body.userID = istoken.userID;
    req.body.city=istoken.city
    next();
    } catch(err){
    res.send(err.message)
    }
}


module.exports= { authentication }