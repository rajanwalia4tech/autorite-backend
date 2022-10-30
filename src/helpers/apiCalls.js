const axios = require('axios');
const config = require("../config");

async function hitValueSerp(keyword,location="India",isQuora=false){
    try{
        console.log("Hitting Value SERP");
        if(isQuora){
            keyword += " site:quora.com";
        }
        let url = `https://api.valueserp.com/search?api_key=${config.apiKeys.valueSerp}&q=${keyword}&location=${location}&num=12&nfpr=1`;
        const response = await axios.get(url);
        return response
    }catch(err){
        console.error(err);
        throw err;
    }
}

module.exports={
    hitValueSerp
}