const redis = require("redis")
const ioredis=require("ioredis")
const redisCoz = redis.createClient();

redisCoz.on("connect", async () => {
    console.log("redis is connected")
})

redisCoz.on("error", (error) => {
    console.log(error.message)
})

redisCoz.connect();

module.exports={redisCoz}