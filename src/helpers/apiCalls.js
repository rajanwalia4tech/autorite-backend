const axios = require('axios');
const config = require("../config");

async function hitValueSerp(keyword,location="India",isQuora=false){
    try{
        console.log("Hitting Value SERP");
        if(isQuora){
            keyword += " site:quora.com";
        }
        let url = `https://api.valueserp.com/search?api_key=${config.apiKeys.valueSerp}&q=${keyword}&location=${location}&nfpr=1`;
        if(isQuora) url +="&num=12";
        const response = await axios.get(url);
        return response
    }catch(err){
        console.error(err);
        throw err;
    }
}

async function hitPexelsAPI(query){
    try{
        let url = `https://api.pexels.com/v1/search?query=${query}&per_page=2&size=large`;
        let options = {
            method : 'GET',
            url,
            headers : {
                "Authorization" : config.apiKeys.pexels
            }
        }
        const response = await axios(options);
        return response
    }catch(err){
        console.error(err);
        throw err;
    }
}


module.exports={
    hitValueSerp,
    hitPexelsAPI
}