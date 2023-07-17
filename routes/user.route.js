
const {Router}=require("express")
const {login,logout,signup}=require("../controllers/user.controller")
const {authentication}=require("../middlewares/auth")

const userRouter=Router()


userRouter.post("/signup",signup)
userRouter.post("/login",login)
userRouter.get("/logout", authentication,logout)

module.exports={userRouter}