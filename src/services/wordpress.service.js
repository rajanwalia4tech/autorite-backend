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

const updateUserWordpressInfo = async(wordPressInfo)=>{
    try {
        await Wordpress.update(wordPressInfo);
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, WORDPRESS.ERROR.DISCONNECT);
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
        if(error.statusCode == httpStatus.NOT_FOUND)
            throw new ApiError(httpStatus.NOT_FOUND, WORDPRESS.ERROR.NOT_CONNECTED);
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
                console.log(error)
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

prepareArraySettings = (arr) => {
    let arrID = arr.map(item => {
        return item.id
    })
    return arrID
}

publishToWordpress = async (request,credentials) => {
    try{
    let username = credentials.username
    let password = credentials.password
    let domain  = credentials.domain

    let data = {
        title: request.title,
        content: request.content,
        status: WORDPRESS.PUBLISH_STATUS[request.publish_status],
    }

    request.categories && request.categories.length ? data.categories = prepareArraySettings(request.categories) : 0
    request.author && request.author.length ? data.author = request.author[0].id : 0
    request.tags && request.tags.length ? data.tags = prepareArraySettings(request.tags) : 0
    request.comment_status ? data.comment_status = request.comment_status : 0
    request.ping_status ? data.ping_status = request.ping_status : 0
    request.publish_password ? data.password = request.publish_password : 0
    // request.featured_media && request.featured_media.length ? data.featured_media = request.featured_media[0].id : 0
    // request.date ? data.date_gmt = request.date : 0
    // request.slug ? data.slug = request.slug : 0

    let headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${username}:${password}`).toString("base64")
    }
    let url = `${domain}/?rest_route=/wp/v2/${request.publish_type}`;
    let options = {
        url,
        method: 'POST',
        headers: headers,
        data: data
    }
    const resp = await axios(options)
    const response = { link : resp.data.link};
    return response
    }catch(error){
        let message = WORDPRESS.ERROR.PUBLISH
        if(error && error.response && error.response.data){
            if(error.response.data.code == "invalid_username"){
                message = WORDPRESS.ERROR.RECONNECT;
            }else if(error.response.data.code == "incorrect_password"){
                message = WORDPRESS.ERROR.RECONNECT;
            }
        }
        throw new ApiError(httpStatus.BAD_REQUEST, message)
    }
}

module.exports = {
    saveUserWordpressInfo,
    verifyWordpressCredentials,
    getWordPressDetails,
    getUserWordpressInfo,
    isDomainAlreadyConnected,
    publishToWordpress
}