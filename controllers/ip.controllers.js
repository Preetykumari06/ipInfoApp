const redisCoz=require("../redis/redis")
const axios=require("axios")
const {userModel}=require("../models/user.model")
const ip=require("../models/ip.model")

const API_KEY=process.env.OW_API_KEY

const city=async (req,res) => {
    try{
        const city=req.params.city || req.body.city;
        const isCityCache=await redisCoz.get(`${city}`)
        console.log(isCityCache)

        if(isCityCache) return res.status(200).send({data: isCityCache});

        const response=await axios.get(`https://ipapi.co/api/#introduction${API_KEY}&q=${city}`)

        const ipData=response.data;
        console.log(ipData)

          await ip.findOneAndUpdate({userId: req.body.userId}, {
            userId:req.body.userId, $push:{previousSearches:city}
          }, {new:true, upsert:true, setDefaultsOnInsert:true})

          return res.send({data:ipData})
    } catch(err){
    return res.status(500).send(err.mesaage)
    }
}

const presentcity=async(req,res)=>{
    try{
        const cities=await ip.aggregate([
            {
                $match: {
                    userId: req.body.userId
                }
            },
            {
                $unwind: "$previousSearches"
            },
            {
                $group: {
                    _id: "$previousSearches",
                    count: {$sum:1}
                }
            },
            {
                sort: {count: -1}
            }
        ]);

        const city=cities[0]["_id"]
        const isCityCache=await redisCoz.get(`${city}`)

        if(isCityCache) return res.status(200).send({data:isCityCache})
        const response=await axios.get(`https://ipapi.co/api/#introduction${API_KEY}&q=${city}`)

        const ipData=response.data;

        redisCoz.set(city, JSON.stringify(ipData), {EX: 30*60})

        await ip.findOneAndUpdate({userId: req.body.userId}, {
            userId:req.body.userId, $push:{previousSearches:city}
          }, {new:true, upsert:true, setDefaultsOnInsert:true})

          return res.send({data:ipData})

    } catch(err){
        return res.status(500).send(err.mesaage)
    }
}


module.exports={presentcity,city}