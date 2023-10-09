import mongoose from "mongoose";
import { MONGO_URI } from "../config/index.js";


const connectToDatabase = () => {
  
  return mongoose.connect(MONGO_URI).then((result)=>{
    console.log("Connection successfull")
  }).catch((err)=>{
    console.log(err);
  })

};

export default connectToDatabase
