import mongoose from "mongoose";
import User from "../models/user.js";
import fs from "fs";
import csvParser from "csv-parser";
import axios from "axios"
'use strict';

export const createuser=(async(req,res,next)=>{
    const {username,password}=req.body
    const newUser = new User({
        username: username,
        password: password,
    });
    newUser.save((err) => {
        if (err) {
            console.error('Error inserting document:', err);
        } else {
            console.log('Document inserted successfully');
        }
    });

})

export const addPortfolio=(async(req,res,next)=>{    
})

export const uploadcsv=(async(req,res,next)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log(req.file);
    const allowedMimeTypes = ['text/csv', 'application/csv','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const allowedFileExtensions = ['csv','xlsx'];
  
    const { mimetype, originalname } = req.file;
    const fileExtension = originalname.split('.').pop();

  
    if (
        !allowedMimeTypes.includes(mimetype) ||
        !allowedFileExtensions.includes(fileExtension)
    ) {
        return res.status(400).json({ error: 'Uploaded file is not a CSV.' });
    }
    const results = [];
    const filepath="C:/Users/dude1/daytracker/daytracker-backend/uploads/"+originalname

    fs.createReadStream(filepath)
    .pipe(csvParser())
    .on('data', (data) => {
        results.push(data);
    })
    .on('end', () => {
        // At this point, `results` contains the CSV data as an array of objects.
        // You can do further processing or convert it to JSON as needed.
        const jsonData = JSON.stringify(results, null, 2);
        const name=originalname.split(".")
        // You can save the JSON data to a file or perform any other actions here.
        fs.writeFileSync("C:/Users/dude1/daytracker/daytracker-backend/userJsonData/"+name[0]+".json", jsonData);
        console.log('CSV to JSON conversion complete.');
    });
    // You can do further processing with the uploaded file here
    const name=originalname.split(".")
    // const data=await jsonTradeBook(name[0])
    res.status(200).send("File saved and converted successfully");
})





export const getTradeBook=(async(req,res,next)=>{
    const filepath="C:/Users/dude1/daytracker/daytracker-backend/userJsonData/"
    const filename=req.params.jsonfilename
    const jsonfilepath=filepath+filename+".json"

    fs.readFile(jsonfilepath,'utf-8',(err,data)=>{
        if (err) {
            console.error('Error reading the file:', err);
            return;
          }
          try {
            const jsonData = JSON.parse(data);
            if(jsonData){
                res.status(200).json(jsonData)
                
            }else{
                res.status(401).json({error:"file error"})
            
            }
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return
          }
    })
    
})





export const demo=((req,res,next)=>{
    const url="http://localhost:3000/api/v1/getJsonTradeBook/"+ "tradebook1";

    
    axios.get(url)
    .then(function (response) {
        // Handle the successful response here
        const data = response.data;
        let results=[]
        let group_buy=[]
        let group_sell=[]
        debugger;
        for (let index = 0; index < data.length-1; index++) {
            let element = data[index];
            let nextelement=data[index+1]
            let prevelement=null
            if(index==0){
                prevelement=data[index]
            }
            if(index>0 && index<data.length-1){
               
                prevelement=data[index-1]
            }
            if(element.trade_type=="buy" && nextelement.trade_type=="sell" && element.quantity==nextelement.quantity && element.symbol==nextelement.symbol){
                const tradeObject={"buytrade":[element],"selltrade":[nextelement]}
                results.push(tradeObject);
                index++
            }
            if(element.trade_type=="sell" && nextelement.trade_type=="buy" && element.quantity==nextelement.quantity && element.symbol == nextelement.symbol){
                const tradeObject={"selltrade":[element],"buytrade":[nextelement]}
                results.push(tradeObject);
                index++
            }
            if(element.trade_type=="buy" && nextelement.trade_type=="sell" && parseInt(element.quantity)>parseInt(nextelement.quantity) && element.symbol==nextelement.symbol){
                group_buy.push(element)
                index++
                element=data[index]
                nextelement=data[index+1]
                while(parseInt(element.trade_id)==(parseInt(nextelement.trade_id)-1)||parseInt(element.trade_id)==(parseInt(nextelement.trade_id)+1)){
                    nextelement.total_qty=parseInt(element.quantity)+parseInt(nextelement.quantity)                   
                    group_sell.push(element,nextelement)
                    index++
                    element=data[index]
                    nextelement=data[index+1]
                }
                const tradeObject={"buytrade":group_buy,"selltrade":group_sell}
                results.push(tradeObject);
                group_buy=[]
                group_sell=[]                
            }
            if(element.trade_type=="buy" && nextelement.trade_type=="buy" && element.symbol==nextelement.symbol || ((parseInt(element.trade_id)==(parseInt(nextelement.trade_id)+1)) || (  parseInt(element.trade_id) == (parseInt(nextelement.trade_id)-1)))){
                //  while(parseInt(element.trade_id)==(parseInt(nextelement.trade_id)+1) || (parseInt(element.trade_id)==parseInt(nextelement.trade_id)+1) || (element.symbol==nextelement.symbol && element.trade_type=="buy" && nextelement.trade_type=="buy")){
                //     nextelement.total_qty=parseInt(element.quantity)+parseInt(nextelement.quantity)                   
                //     group_buy.push(element,nextelement)
                //     index++
                //     element=data[index]
                //     nextelement=data[index+1]
                //     element=data[index+2]
                //     nextelement=data[index+3]

                // }
                while(element.trade_type=="buy"){
                    group_buy.push(element)
                    index++
                    element=data[index]
                }
                console.log(index);
                if(element.symbol==nextelement.symbol && element.total_qty==nextelement.quantity && nextelement.trade_type=="sell"){
                    group_sell.push(nextelement)
                    const tradeObject={"buytrade":group_buy,"selltrade":group_sell}
                    results.push(tradeObject);
                    group_buy=[]
                    group_sell=[]
                }else{
                    index++
                    element=data[index]
                    nextelement=data[index+1]
                    if(element.trade_type=="sell" && nextelement.trade_type=="sell" && element.symbol==nextelement.symbol || parseInt(element.trade_id)==(parseInt(nextelement.trade_id)-1) || parseInt(element.trade_id)==(parseInt(nextelement.trade_id)+1)){
                        while (element.symbol==nextelement.symbol && element.trade_type=="sell" && nextelement.trade_type=="sell" || parseInt(element.trade_id)==(parseInt(nextelement.trade_id)-1) || parseInt(element.trade_id)==(parseInt(nextelement.trade_id)+1)) {
                            nextelement.total_qty=parseInt(element.quantity)+parseInt(nextelement.quantity)                   
                            group_sell.push(element,nextelement)
                            index++
                            element=data[index]
                            nextelement=data[index+1]
                        }
                    }
                    const tradeObject={"buytrade":group_buy,"selltrade":group_sell}
                    results.push(tradeObject);
                    group_buy=[]
                    group_sell=[]
                }
            }
            if(element.trade_type=="buy" && nextelement.trade_type=="sell" && element.symbol==nextelement.symbol  && element.quantity>nextelement.quantity ){
                group_buy.push(element)
                index++
                element=data[index]
                nextelement=data[index+1]
                while(element.trade_type=="sell" && nextelement.trade_type=="sell" || parseInt(element.trade_id)==parseInt(nextelement.trade_id+1)||parseInt(element.trade_id)==parseInt(nextelement.trade_id+1)){
                    group_sell.push(element,nextelement)
                    index++
                    element=data[index]
                    nextelement=data[index+1]
                }
            }


        }
        console.log(results.length);
        res.status(200).json({"data":results})
     
        
      })
      .catch(function (error) {
        // Handle any errors here
        console.error(error);
    });
    

});


export const functionalTradeBook=((req,res,next)=>{
    const url="http://localhost:3000/api/v1/getJsonTradeBook/"+ "tradebook1";
    axios.get(url)
    .then(function (response) {
        // Handle the successful response here
        const data = response.data;
        const results=[]
        
        for (let index = 0; index < data.length-1; index++) {
            const element = data[index];
            const nextelement=data[index+1]
            let prevelement=null
            if(index==0){
                prevelement=data[index]
            }
            if(index>0 && index<data.length-1){      
                 prevelement=data[index-1]
            }
            console.log(element.symbol.split());
            if(element.trade_type=="buy"){
    
                for (let searchindex = index+1; searchindex < data.length; searchindex++) {
                    const search=data[searchindex]
                    if(search.trade_type=="sell" && element.quantity==search.quantity && element.symbol==search.symbol){
                        const tradeObject={"buytrade":[element],"selltrade":[search]}
                        results.push(tradeObject);
                        index=searchindex 
                    }
                    if(search.trade_type=="buy"){
                        const tradeObject={"buytrade":[element,search]}
                        results.push(tradeObject);
                        index=searchindex 
                    }
                    break   
                }
            }
        
           
            if(element.trade_type=="sell" && element.trade_id!=prevelement.trade_id-1 ){
                for (let searchindex = index+1; searchindex < data.length; searchindex++) {
                    const search=data[searchindex]
                    if(search.trade_type=="buy" && element.quantity==search.quantity && element.symbol==search.symbol ){
                        const tradeObject={"selltrade":[element],"buytrade":[search]}
                        results.push(tradeObject); 
                        // console.log("Buy Trade " + element.trade_id + " Sell Trade " + search.trade_id);
                    }
                    break
                
                }

            }
            // if (element.trade_type === "buy" && nextelement.trade_type === "buy") {
            //     index+=2
            //     const buyObject = {"buytrade": [element, nextelement]};
            //     results.push(buyObject)
            //     continue; // Skip pairs of consecutive buy trades
            // }
        

            
        }
        res.status(200).json({"data":results})

        
      })
      .catch(function (error) {
        // Handle any errors here
        console.error(error);
    });
    

});

export const saveToDatabase=(async(req,res,next)=>{
})