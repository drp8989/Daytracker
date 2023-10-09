import user from "../routes/user.js"
import express from "express";
import cors from "cors";


const App=(app)=>{
    

    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/v1",user);

}

export default App