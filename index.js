import express, { response } from "express"
import connectToDatabase from "./services/database.js";
import App from "./services/App.js";
import multer from "multer";


const app=express();

//Database Connection
await connectToDatabase()
await App(app);


app.listen("3000",()=>{
    console.log("Hello");
})