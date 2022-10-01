const apiCalls = require("../helpers/apiCalls");
const {generateService} = require("../services");

function getRelatedQuestions(keyword,location){
    return new Promise(async (resolve,reject)=>{
        try{
            const response = await apiCalls.hitValueSerp(keyword,location);
            let relatedQuestions = [];
            let MAXIMUM_RELATED_QUESTIONS = 4;
            if(response.data.related_questions){
                for(let el of response.data.related_questions){
                    if(el.question){
                        relatedQuestions.push(el.question.trim());
                    }
                    if(relatedQuestions.length === MAXIMUM_RELATED_QUESTIONS){
                        break;
                    }
                }
            }
            resolve(relatedQuestions);
        }catch(err){
            reject(err);
        }
    });
}

function getQuoraQuestions(keyword,location){
    return new Promise(async (resolve,reject)=>{
        try{
            const response = await apiCalls.hitValueSerp(keyword,location,true);
            let quoraQuestions = [];
            let MAXIMUM_QUORA_QUESTIONS = 8;
            if(response.data.organic_results){
                for(let el of response.data.organic_results){
                    if(el.title){
                        quoraQuestions.push(el.title.replace(/\s(-|:)\s(\w+\b){0,}(\/\w+){0,}/g," ").trim());
                    }
                    if(quoraQuestions.length === MAXIMUM_QUORA_QUESTIONS){
                        break;
                    }
                }
            }
            resolve(quoraQuestions);
        }catch(err){
            reject(err);
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
        throw err;
    }
}

async function getAIHeadings(keyword,usecase){
    try{
        const result = await generateService.generate({topic:keyword},usecase);
        let aiHeadings = result[0].text.trim();
        aiHeadings = aiHeadings.split("\n");
        return aiHeadings;
    }catch(err){
        throw err;
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
        return introductionParagraph;
    }catch(err){
        throw err;
    }
}


async function getAnswersAndParagraph(keyword,payload,usecases){
    try{
       const relatedQuestionsAnswers = getQuestionsAnswers(payload.relatedQuestions,usecases[2]);
       const aiQuestionAnswers =  getQuestionsAnswers(payload.aiQuestions,usecases[2]);
       const quoraQuestionsAnswers = getQuestionsAnswers(payload.quoraQuestions,usecases[3]);
       const headingsParagraphs =  getHeadingsParagraphs(payload.aiHeadings,keyword,usecases[4]);
       const conclusionParagraph = getConclusionParagraph(keyword,usecases[5]);
       const introductionParagraph = getIntroductionParagraph(keyword,usecases[6]);
       const result = await Promise.all([relatedQuestionsAnswers,aiQuestionAnswers,quoraQuestionsAnswers,headingsParagraphs,conclusionParagraph,introductionParagraph]);

       return {
            relatedQuestionsAnswers:result[0],
            aiQuestionAnswers:result[1],
            quoraQuestionsAnswers:result[2],
            headingsParagraphs:result[3],
            conclusionParagraph:result[4],
            introductionParagraph:result[5]
        };
    }catch(err){
        throw err;
    }

}

async function createArticle(keyword,location){
    try{
        const usecases = await generateService.getAllUsecases();
        const questionsHeadings = await getAllQuestionsAndHeadings(keyword,location,usecases);
        const result = await getAnswersAndParagraph(keyword,questionsHeadings,usecases);
        const article = {
            keyword,
            location,
            result
        };
        return article;
    }catch(err){
        throw err;
    }
}

module.exports = {
    createArticle
}