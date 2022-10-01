const axios = require('axios');
const config = require("../config");

async function hitValueSerp(keyword,location="India",isQuora=false){
    if(isQuora){
        keyword += " site:quora.com";
    }
    let url = `https://api.valueserp.com/search?api_key=${config.apiKeys.valueSerp}&q=${keyword}&num=60&location=${location}&nfpr=1`;
    const response = await axios.get(url);
    return response
}

module.exports={
    hitValueSerp
}