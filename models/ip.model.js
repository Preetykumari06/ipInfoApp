const mongoose=require("mongoose")
const searchSchema=mongoose.Schema({
    ipaddress:String,
    city:String,
    timeStamp:{type:Date,default:Date.now}
})

const SearchModel=mongoose.model("search",searchSchema)

module.exports={SearchModelearchModel}