const {Generate} = require("../db");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { Configuration, OpenAIApi } = require("openai");

const getAllUsecases = async ()=>{
    const usecases = await Generate.findAll();
    return usecases;
}

const getUsecaseById = async (usecase_id)=>{
    const [usecase] = await Generate.findByUsecaseId(usecase_id);
    if(!usecase){
        throw new ApiError(httpStatus.NOT_FOUND, 'Usecase not found');
    }

    return usecase;
}

const generate = async(payload,usecaseInfo)=>{
    const openAIPayload = createOpenAIPayload(payload,usecaseInfo);
    const completion = await hitOpenAICompletion(openAIPayload);
    return completion.data.choices;
}

const createOpenAIPayload = (payload,usecaseInfo)=>{
    let openAIPayload = {
        model : usecaseInfo.model,
        prompt: createPrompt(payload,usecaseInfo),
        max_tokens: usecaseInfo.max_tokens,
        temperature: usecaseInfo.temperature,
        top_p: usecaseInfo.top_p,
        presence_penalty: usecaseInfo.presence_penalty,
        frequency_penalty: usecaseInfo.frequency_penalty,
        stop: usecaseInfo.stop_sequence,
        n : usecaseInfo.n_value
    }

    return openAIPayload;
}

const createPrompt = (payload,usecaseInfo)=>{
    let prompt = usecaseInfo.pre_prompt + usecaseInfo.prompt;
    if(usecaseInfo.fields){
        usecaseInfo.fields.forEach(field=>{
            prompt += field.prefix + payload[field.key] + field.postfix;
        });
    }

    if(usecaseInfo.post_prompt){
        prompt += usecaseInfo.post_prompt;
    }
    
    return prompt;
}


const hitOpenAICompletion = async (payload)=>{
    try {
        const configuration = new Configuration({
            apiKey: config.apiKeys.openAI,
        });          
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createCompletion(payload);
        return completion;
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        throw new Error(error)
    }
}

module.exports = {
    getAllUsecases,
    getUsecaseById,
    generate
}