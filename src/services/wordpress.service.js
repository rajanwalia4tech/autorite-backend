const {Wordpress} = require("../db")
const {WORDPRESS,ERROR} =require("../utils/constants")
const axios = require("axios")
const ApiError = require("../utils/ApiError")
const httpStatus = require("http-status");

const saveUserWordpressInfo = async(wordPressInfo)=>{
    try {
        // TODO: check if username and domain have already has wordpress info
        const result = await Wordpress.create(wordPressInfo);
        return result;
    } catch (error) {
        throw error;
    }
}

const isDomainAlreadyConnected = async(domain)=>{
    const [wordpressInfo] = await Wordpress.findByDomain(domain);
    if(wordpressInfo)
        throw new ApiError(httpStatus.NOT_FOUND, WORDPRESS.ERROR.ALREADY_CONNECTED_DOMAIN);
    return ;
}

const getUserWordpressInfo = async(userId)=>{
    try {
        const [wordpressInfo] = await Wordpress.findByUserId(userId);
        if(!wordpressInfo)
            throw new ApiError(httpStatus.NOT_FOUND, WORDPRESS.ERROR.NOT_CONNECTED);
        return wordpressInfo;
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, ERROR.MESSAGE);
    }
}

const wordpressGetApiHit = async (username,password,domain, type) => {

    let headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
    }

    const response = await axios.get(`${domain}/?rest_route=/wp/v2/${type}`, {
        headers: headers,

    })
    return response
}

const wordpressHitResponse = async (credentials, request_type) => {
    let result = []
    try {
        let response = await wordpressGetApiHit(credentials.username,credentials.password,credentials.domain, request_type)
        if (response.data && response.data.length) {
            response.data.map(user => {
                result.push({ id: user.id, name: user.name, slug: user.slug, avatar: user.avatar_urls })
            })
        }

        return result
    } catch (error) {
        return result
    }

}

const getWordPressDetails = async (credentials) => {
    const usersPromise =  wordpressHitResponse(credentials,WORDPRESS.ROUTE_TYPE.USERS);
    const categoriesPromise =  wordpressHitResponse(credentials,WORDPRESS.ROUTE_TYPE.CATEGORIES);
    const tagsPromise =  wordpressHitResponse(credentials,WORDPRESS.ROUTE_TYPE.TAGS);
    const result = await Promise.all([usersPromise,categoriesPromise,tagsPromise]);
    return {users : result[0],categories:result[1],tags:result[2]};
}

const verifyWordpressCredentials = async (username,password,domain) => {
        try {
            let data = {}

            let headers = {
                "Content-Type": "application/json",
                "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
            }

            const response = await axios.post(`${domain}/wp-json/wp/v2/posts`, data, {
                headers: headers,

            })
            return true;
        } catch (error) {
            if (error && error.response && error.response.data && error.response.data.code == "empty_content") {
                return true;
            } else if (error.code == "ENOTFOUND") {
                throw new ApiError(httpStatus.BAD_REQUEST ,WORDPRESS.ERROR.DOMAIN)
            } else {
                // let message = (error && error.response && error.response.data && error.response.data.code == "invalid_username" ? message = WORDPRESS.ERROR.USERNAME : error && error.response && error.response.data && error.response.data.code == "incorrect_password") ? WORDPRESS.ERROR.PASSWORD: WORDPRESS.ERROR.GENERIC_ERR
                let message = WORDPRESS.ERROR.GENERIC_ERR
                if(error && error.response && error.response.data){
                    if(error.response.data.code == "invalid_username"){
                        message = WORDPRESS.ERROR.USERNAME;
                    }else if(error.response.data.code == "incorrect_password"){
                        message = WORDPRESS.ERROR.PASSWORD;
                    }
                }
                throw new ApiError(httpStatus.BAD_REQUEST ,message)
            }
        }
}

module.exports = {
    saveUserWordpressInfo,
    verifyWordpressCredentials,
    getWordPressDetails,
    getUserWordpressInfo,
    isDomainAlreadyConnected
}