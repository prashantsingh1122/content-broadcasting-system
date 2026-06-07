const redis=require('redis');
 let client=null
 let isConnected=false

 const getClient=async()=>{
    if(client && isConnected){
        return client;
    }
    client=redis.createClient({
        url=process.env.REDIS_URL
    })
    client.on("error",(err)=>{
        console.error("Redis Client Error",err)
        isConnected=false
    })
    client.on('connect',()=>{
        console.log("Connected to Redis")
        isConnected=true
    })  
try{
        await client.connect()
        isConnected=true
    }
    catch(err){
        console.error("Failed to connect to Redis",err)
        console.log("Starting Redis client without connection")
        isConnected=false
    }
    return client
}

const getCache=async(key)=>{
    try{
        const c=await getClient()
        if (!isConnected) return null
        const data = await c.get(key)
        return data ? JSON.parse(data) : null

    }
    catch(err){
        console.error("Error getting cache from Redis",err)
        return null
    }  
}

const setCache=async(key,data,ttl=3600)=>{
    try{
        const c=await getClient()
        if (!isConnected) return
        await c.setEx(key,ttl,JSON.stringify(data))
    }
    catch(err){
        console.error("Error setting cache in Redis",err)
    }
}

const deleteCache=async(key)=>{
    try{
        const c=await getClient()
        if (!isConnected) return
        await c.del(key)
        console.log(`Cache with key ${key} deleted from Redis`)
    }
    catch(err){
        console.error("Error deleting cache from Redis",err)
    }
}
module.exports={getCache,setCache,deleteCache}