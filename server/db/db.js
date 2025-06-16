import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI


const connectDB = async()=>{
    try{
        mongoose.connect(MONGO_URI)
    }catch(err){
        console.error(err)
        throw err
    }
}