const {dbHandler} = require("./db");

const saveArticle = (payload)=>{
    return new Promise(async (resolve, reject) => {
        const query = `INSERT INTO user_articles SET ?;`;
        let queryObj = {
            query,
            args: [payload],
            event: "create article"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}

const saveArticleInfo = (payload)=>{
    return new Promise(async (resolve, reject) => {
        const query = `INSERT INTO user_article_info SET ?;`;
        let queryObj = {
            query,
            args: [payload],
            event: "save user Article Info"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}


const updateArticle = (payload)=>{
    console.log(payload);
    if (!Object.keys(payload.fields).length)
        return Promise.reject("fields cannot be empty");
    return new Promise((resolve, reject) => {
        let query = `UPDATE user_articles SET `;
        let { fields } = payload;
        query = Object.keys(fields).reduce(
            (acc, curr) => acc + ` ${curr} ` + " = ?,",
            query
        );

        query = query.slice(0, -1) + ` WHERE id = ? `;
        if (payload.user_id) query += ` AND user_id = ${payload.user_id}`;
        console.log(query);
        let queryObj = {
            query: query,
            args: [...Object.values(payload.fields), payload.article_id],
            event: "update article",
        };
        dbHandler.executeQuery(queryObj).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}


const updateArticleInfo = (payload)=>{
    return new Promise(async (resolve, reject) => {
        const query = `UPDATE user_article_info SET ?;`;
        let queryObj = {
            query,
            args: [payload],
            event: "update user Article Info"
        }
        dbHandler.executeQuery(queryObj)
            .then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
    });
}

const updateArticleInfoById = (payload)=>{
    console.log(payload);
    if (!Object.keys(payload.fields).length)
        return Promise.reject("fields cannot be empty");
    return new Promise((resolve, reject) => {
        let query = `UPDATE user_article_info SET `;
        let { fields } = payload;
        query = Object.keys(fields).reduce(
            (acc, curr) => acc + ` ${curr} ` + " = ?,",
            query
        );

        query = query.slice(0, -1) + ` WHERE article_id = ? `;
        if (payload.user_id) query += ` AND user_id = ${payload.user_id}`;
        console.log(query);
        let queryObj = {
            query: query,
            args: [...Object.values(payload.fields), payload.article_id],
            event: "update article",
        };
        dbHandler.executeQuery(queryObj).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

const getArticleInfo = (payload)=>{
    return new Promise((resolve, reject) => {
        let query = `SELECT ua.id,ua.article_id,ua.user_id,ua.keyword,ua.title,ua.location,uai.featured_image, uai.related_questions,uai.ai_questions,uai.quora_questions, uai.headings_paragraph, uai.conclusion_paragraph,uai.introduction_paragraph,uai.html_content,uai.created_at,uai.updated_at FROM user_articles ua INNER JOIN user_article_info uai ON uai.article_id=ua.id WHERE ua.id=${payload.article_id} `;
        if(payload.user_id) 
            query += ` AND ua.user_id = ${payload.user_id};`
        let queryObj = {
            query: query,
            args: [],
            event: "update article",
        };
        dbHandler.executeQuery(queryObj).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });

}


const getAllArticlesByUserId = (payload)=>{
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM user_articles ua WHERE ua.user_id=${payload.user_id} `;
        
        let queryObj = {
            query: query,
            args: [],
            event: "update article",
        };
        dbHandler.executeQuery(queryObj).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });

}

const getArticleInfoById = (payload)=>{
    return new Promise((resolve, reject) => {
        if(!payload.fields)
            throw new Error("fields cannot be empty");
        let fields = "";
        for(let el of payload.fields){
            fields+=el+",";
        }
        fields = fields.slice(0,-1);
        let query = `SELECT ${fields} FROM user_article_info  WHERE article_id=${payload.article_id} `;

        if(payload.user_id) 
            query += ` AND user_id = ${payload.user_id};`
        let queryObj = {
            query: query,
            args: [],
            event: "getArticleInfoById",
        };
        dbHandler.executeQuery(queryObj).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}


const getUserArticle = (payload)=>{
    return new Promise((resolve, reject) => {
        if(!payload.fields)
            throw new Error("fields cannot be empty");
        let fields = "";
        for(let el of payload.fields){
            fields+=el+",";
        }
        fields = fields.slice(0,-1);
        let query = `SELECT ${fields} FROM user_articles  WHERE id=?`;

        if(payload.user_id) 
            query += ` AND user_id = ${payload.user_id};`
        let queryObj = {
            query: query,
            args: [payload.article_id],
            event: "getArticleInfoById",
        };
        dbHandler.executeQuery(queryObj).then(
            (result) => {
                resolve(result);
            },
            (error) => {
                reject(error);
            }
        );
    });
}

const countAllArticles = (payload)=>{
    let query = `SELECT COUNT(*) as total_articles FROM user_articles WHERE user_id=${payload.user_id} AND status="${payload.status}"`;
    let queryObj = {
        query: query,
        args: [],
        event: "getArticleInfoById",
    };
    return dbHandler.executeQuery(queryObj);
}

module.exports = {
    saveArticle,
    saveArticleInfo,
    updateArticle,
    updateArticleInfo,
    updateArticleInfoById,
    getArticleInfo,
    getAllArticlesByUserId,
    getArticleInfoById,
    getUserArticle,
    countAllArticles
}