import {Redis} from "ioredis"

const getRedisUrl =()=>{
    if(process.env.REDIS_URL){
        return process.env.REDIS_URL;
    }
    throw new Error("Redis_Url is not defined")
}

// to initilized the client and use redis

export const redis = new Redis(getRedisUrl());