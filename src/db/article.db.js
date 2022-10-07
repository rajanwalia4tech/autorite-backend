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

const getArticleInfo = (payload)=>{
    return new Promise((resolve, reject) => {
        let query = `SELECT ua.id,ua.article_id,ua.user_id,ua.keyword,ua.title,ua.location, uai.related_questions,uai.ai_questions,uai.quora_questions, uai.headings_paragraph, uai.conclusion_paragraph,uai.introduction_paragraph,uai.created_at,uai.updated_at FROM user_articles ua INNER JOIN user_article_info uai ON uai.article_id=ua.id WHERE ua.id=${payload.article_id} `;
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


module.exports = {
    saveArticle,
    saveArticleInfo,
    updateArticle,
    updateArticleInfo,
    getArticleInfo,
    getAllArticlesByUserId
}