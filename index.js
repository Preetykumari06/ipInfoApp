const express = require("express")

const {connection}=require("./config/db")
const redisCoz=require("./redis/redis")
const {userRouter}=require("./routes/user.route")
const { authentication } = require("./middlewares/auth")
require("dotenv").config()

const app=express()
app.use(express.json())

app.use("/api/user", userRouter)
app.use(authentication)
app.use("/api/ip",router)

app.get("/", (req,res)=>{
    res.send("base route")
})



app.listen(process.env.PORT, async() =>{
    try{
       await connection
       console.log("Connected to the DB") 
    } catch(err){
       console.log(err)
       console.log("Can't connected to the DB")
    }
    console.log(`Server is running at ${process.env.PORT}`)
})