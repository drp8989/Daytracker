import  express  from "express";
import  {createuser, uploadcsv,getTradeBook, demo, functionalTradeBook}  from "../controllers/userController.js";
import multer from 'multer';

import path from 'path';
import {fileURLToPath} from 'url';


const router=express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Set the upload directory
    },
    filename: (req, file, cb) => {
      cb(null,file.originalname); // Use a unique filename
    },
});
const upload = multer({ storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.post("/create",createuser)

router.get("/test",(req,res)=>{
  
  res.sendStatus(200).json({msg:"OK"})

})

router.post("/uploadcsv", upload.single('file'),uploadcsv);
router.get("/getJsonTradeBook/:jsonfilename",getTradeBook)
router.get("/functionaltradebook",functionalTradeBook)
router.get("/demobook",demo)
// router.get("/tradebook",jsonTradeBook)



export default router