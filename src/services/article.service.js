const apiCalls = require("../helpers/apiCalls");
const {generateService} = require("../services");
const {Article} = require("../db");
const {ARTICLE} = require("../utils/constants");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const _ = require("underscore")

function filterNItems(arr,n){ // Randomly select n items from array
    return _.sample(arr,n);
}

function getRelatedQuestions(keyword,location){
    return new Promise(async (resolve,reject)=>{
        try{
            const response = await apiCalls.hitValueSerp(keyword,location);
            let relatedQuestions = [];
            let MAXIMUM_RELATED_QUESTIONS = 4;
            if(response.data.related_questions){
                let related_questions = response.data.related_questions;
                for(let el of related_questions){
                    let idx = el.question.lastIndexOf("?");
                    if(idx != -1){
                        relatedQuestions.push(el.question.slice(0,idx+1));
                    }
                }
            }
            // relatedQuestions = filterNItems(relatedQuestions,MAXIMUM_RELATED_QUESTIONS);
            resolve(relatedQuestions);
        }catch(err){
            console.error(err);
            resolve([]);
        }
    });
}

function getQuoraQuestions(keyword,location){
    return new Promise(async (resolve,reject)=>{
        try{
            const response = await apiCalls.hitValueSerp(keyword,location,true);
            let quoraQuestions = [];
            let MAXIMUM_QUORA_QUESTIONS = 6;
            if(response.data.organic_results){
                let organic_results = response.data.organic_results;
                for(let el of organic_results){
                    let idx = el.title.lastIndexOf("?");
                    if(idx != -1){
                        quoraQuestions.push(el.title.slice(0,idx+1));
                    }
                }
            }
            console.time()
            // quoraQuestions = filterNItems(quoraQuestions,MAXIMUM_QUORA_QUESTIONS);
            resolve(quoraQuestions);
        }catch(err){
            console.error(err);
            resolve([]);
        }
    });
}

async function getAIQuestions(keyword,usecase){
    try{
        const result = await generateService.generate({topic:keyword},usecase);
        let aiQuestions = result[0].text.trim();
        aiQuestions = aiQuestions.split("\n");
        return aiQuestions;
    }catch(err){
        console.error(err);
        resolve([]);
    }
}

async function getAIHeadings(keyword,usecase){
    try{
        const result = await generateService.generate({topic:keyword},usecase);
        let aiHeadings = result[0].text.trim();
        aiHeadings = aiHeadings.split("\n");
        aiHeadings = removeCounting(aiHeadings);
        return aiHeadings;
    }catch(err){
        console.error(err);
        resolve([]);
    }
}

async function getAllQuestionsAndHeadings(keyword,location,usecases){
    const aiQuestions = getAIQuestions(keyword,usecases[0]);
    const aiHeadings = getAIHeadings(keyword,usecases[1]);
    const relatedQuestions = getRelatedQuestions(keyword,location);
    const quoraQuestions =  getQuoraQuestions(keyword,location);
    const result = await Promise.all([relatedQuestions,quoraQuestions,aiQuestions,aiHeadings]);
    return {
        keyword,
        relatedQuestions : result[0],
        quoraQuestions : result[1],
        aiQuestions : result[2],
        aiHeadings : result[3]
    };
}

async function getQuestionsAnswers(questions,usecase){
    try{
        let questionsAnswers = [];
        let promises = [];
        questions.map(el=>{
            promises.push(generateService.generate({question:el},usecase));
        })
        const answers = await Promise.all(promises);
        for(let i=0;i<questions.length;i++){
            if(answers[i][0].text)
                questionsAnswers.push({
                    question : questions[i],
                    answer : answers[i][0].text.trim()
                });
        }
        return questionsAnswers;
    }catch(err){
        throw err;
    }
}

async function getHeadingsParagraphs(headings,keyword,usecase){
    try{
        let headingsParagraphs = [];
        let promises = [];
        headings.map(el=>{
            promises.push(generateService.generate({topic:keyword,subHeading:el},usecase));
        })
        const paragraphs = await Promise.all(promises);
        for(let i=0;i<headings.length;i++){
            if(paragraphs[i][0].text)
                headingsParagraphs.push({
                    heading : headings[i],
                    paragraph : paragraphs[i][0].text.trim()
                });
        }
        return headingsParagraphs;
    }catch(err){
        throw err;
    }
}

async function getConclusionParagraph(keyword,usecase){
    try{
        const result = await generateService.generate({topic:keyword},usecase);
        let conclusion = result[0].text.trim();
        return conclusion;
    }catch(err){
        throw err;
    }
}


async function getIntroductionParagraph(keyword,usecase){
    try{
        const result = await generateService.generate({topic:keyword},usecase);
        let introductionParagraph = result[0].text.trim();
        introductionParagraph = introductionParagraph.startsWith("Introduction Paragraph:")?introductionParagraph.substring(24):introductionParagraph;
        return introductionParagraph;
    }catch(err){
        throw err;
    }
}

async function getTitle(keyword,usecase){
    try{
        const result = await generateService.generate({keyword},usecase);
        let titles = result[0].text.trim().split("\n");
        titles = removeCounting(titles);
        return titles[0];
    }catch(err){
        console.error(err)
        return "";
    }
}

function removeCounting(arr){
    return arr.map(el=>{
        return el.replace(/\d+\.\s/g,""); // Add optional space \s
    })
}

async function getMetaDescription(keyword,title,usecase){
    try{
        const result = await generateService.generate({topic:title,keywords : keyword},usecase);
        let metaDescription = result[0].text.trim().split("\n");
        metaDescription = removeCounting(metaDescription);
        return metaDescription[0];
    }catch(err){
        console.error(err)
        return "";
    }
}

async function getAnswersAndParagraph(keyword,title,payload,usecases){
    try{
       const relatedQuestionsAnswers = getQuestionsAnswers(payload.relatedQuestions,usecases[2]);
       const aiQuestionAnswers =  getQuestionsAnswers(payload.aiQuestions,usecases[2]);
       const quoraQuestionsAnswers = getQuestionsAnswers(payload.quoraQuestions,usecases[3]);
       const headingsParagraphs =  getHeadingsParagraphs(payload.aiHeadings,keyword,usecases[4]);
       const conclusionParagraph = getConclusionParagraph(keyword,usecases[5]);
       const introductionParagraph = getIntroductionParagraph(keyword,usecases[6]);
       const metaDescription = getMetaDescription(keyword,title, usecases[8]);
       const result = await Promise.all([relatedQuestionsAnswers,aiQuestionAnswers,quoraQuestionsAnswers,headingsParagraphs,conclusionParagraph,introductionParagraph,metaDescription]);

       return {
            relatedQuestionsAnswers:result[0],
            aiQuestionAnswers:result[1],
            quoraQuestionsAnswers:result[2],
            headingsParagraphs:result[3],
            conclusionParagraph:result[4],
            introductionParagraph:result[5],
            metaDescription:result[6]
        };
    }catch(err){
        throw err;
    }

}

async function getFeaturedImage(keyword,usecase){
    try{
        const result = await generateService.generate({title:keyword},usecase);
        let keywordsString = result[0].text.trim();
        let keywords = keywordsString.split(",");
        const res  = await apiCalls.hitPexelsAPI(keywords[0].trim());
        const {data} = res;
        if(res.status == httpStatus.OK &&  data && data.photos && data.photos.length>0){
            if(data.photos[0].src && data.photos[0].src.medium){
                return data.photos[0].src.medium;
            }
        }
        return null;
    }catch(err){
        console.error(err);
        return null;
    }
}

async function createArticle(userId,keyword,title,location){
    let articleId;
    try{
        const article = await Article.saveArticle({user_id:userId,keyword,location,status:ARTICLE.STATUS.IN_PROGRESS});
        articleId = article.insertId;
        
        const usecases = await generateService.getAllUsecases();
        let featureImageUrl = getFeaturedImage(keyword,usecases[9]);
        if(!title)
            title = await getTitle(keyword,usecases[7]);
        const questionsHeadings = await getAllQuestionsAndHeadings(keyword,location,usecases);
        let  result = await getAnswersAndParagraph(keyword,title,questionsHeadings,usecases);
        
        featureImageUrl = await featureImageUrl;

        await Article.saveArticleInfo({
            title,
            user_id : userId,
            article_id:articleId,
            featured_image : featureImageUrl,
            related_questions: JSON.stringify(result.relatedQuestionsAnswers),
            ai_questions: JSON.stringify(result.aiQuestionAnswers),
            quora_questions: JSON.stringify(result.quoraQuestionsAnswers),
            headings_paragraph : JSON.stringify(result.headingsParagraphs),
            conclusion_paragraph : result.conclusionParagraph,
            introduction_paragraph : result.introductionParagraph,
            meta_description : result.metaDescription
        });
        await Article.updateArticle({
            user_id : userId,
            article_id:articleId,
            fields:{
                status:ARTICLE.STATUS.COMPLETED,
                title
            }
        })
        return articleId;
    }catch(err){
        if(articleId){
            await Article.updateArticle({
                user_id : userId,
                article_id:articleId,
                fields:{
                    status:ARTICLE.STATUS.FAILED,
                    title : title || null
                }
            })
        }
        console.log("Error in createArticle",err);
        throw new ApiError(httpStatus.BAD_REQUEST,ARTICLE.ERROR.CREATION_FAILED);
    }
}

async function getArticle(userId,articleId){
    try{
        const [articleInfo] = await Article.getArticleInfo({
            user_id : userId,
            article_id:articleId
        })
        if(articleInfo){
            return articleInfo;
        }else{
            throw new ApiError(httpStatus.NOT_FOUND,ARTICLE.ERROR.NOT_FOUND);
        }
    }catch(err){
        console.log("getArticle",err);
        if(err.statusCode == httpStatus.NOT_FOUND)
            throw err;
        throw new ApiError(httpStatus.BAD_REQUEST,ARTICLE.ERROR.FETCH_FAILED);
    }
}

async function getAllArticles(userId){
    try{
        const articles = await Article.getAllArticlesByUserId({
            user_id : userId
        })
        if(articles){
            return articles;
        }else{
            throw new ApiError(httpStatus.NOT_FOUND ,ARTICLE.ERROR.NOT_FOUND);
        }
    }catch(err){
        console.log("getAllArticles",err);
        if(err.statusCode == httpStatus.NOT_FOUND)
            throw err;
        throw new ApiError(httpStatus.BAD_REQUEST,ARTICLE.ERROR.FETCH_FAILED);
    }
}

async function saveArticleById(userId,articleId,htmlContent){
    try{
        const [article] = await Article.getArticleInfoById({
            user_id : userId,
            article_id:articleId,
            fields : ["id"]
        })
        if(article){
            await Article.updateArticleInfoById({
                article_id : articleId,
                user_id : userId,
                fields : {
                    html_content : htmlContent
                }
            });
        }else{
            throw new ApiError(httpStatus.FORBIDDEN ,ARTICLE.ERROR.NOT_ALLOWED);
        }
    }catch(err){
        console.log("saveArticleById",err);
        if(err.statusCode == httpStatus.FORBIDDEN)
            throw err;
        throw new ApiError(httpStatus.BAD_REQUEST,ARTICLE.ERROR.FETCH_FAILED);
    }
}

async function getArticleInfo(userId,articleId){
    try{
        const [article] = await Article.getUserArticle({
            user_id : userId,
            article_id:articleId,
            fields : ["id","keyword","location","status"]
        })
        if(article){
            return article;
        }else{
            throw new ApiError(httpStatus.FORBIDDEN ,ARTICLE.ERROR.NOT_ALLOWED);
        }
    }catch(err){
        console.log("saveArticleById",err);
        if(err.statusCode == httpStatus.FORBIDDEN)
            throw err;
        throw new ApiError(httpStatus.BAD_REQUEST,ARTICLE.ERROR.FETCH_FAILED);
    }
}

module.exports = {
    createArticle,
    getArticle,
    getAllArticles,
    saveArticleById,
    getArticleInfo
}