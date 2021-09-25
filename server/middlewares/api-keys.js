const { json } = require("express");
require('dotenv').config();

module.exports = (req,res,next)=>{
    const apiKeys = new Map();
    apiKeys.set(process.env.API_KEY);

    const apiKey = req.get('x-api-key');
    if(apiKeys.has(apiKey)){
        next()
    }
    else{
        res.json({
            message:'Invalid API KEY'
        })
    }
    
}
