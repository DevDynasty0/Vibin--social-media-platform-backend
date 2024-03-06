import { Router } from "express";
// import modules from OpenAI library
import OpenAI from "openai";
import { createVibinPost } from "../controllers/vibinPost.controller.js";


const vibinAIRouter = Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

vibinAIRouter.route("/genarate-caption").post(async (req, res) => {

    try {
        const { prompt } = req.body;

        const completion = await openai.chat.completions.create({
            messages: [{ "role": "user", "content": prompt }],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0].message.content);
        return res.send({
            caption: completion.choices[0].message.content
        })

    } catch (error) {
        console.log(error);
    }
})


vibinAIRouter.route("/genarate-image").post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            n: 1,
            // size: "1024x1024",
            quality:'standard'
        });
       

        console.log(response);
        return res.send({
            imageUrl: response.data
        })


    } catch (error) {
        console.log(error);
    }

})
vibinAIRouter.route('/post-generated-data').post(createVibinPost)
export default vibinAIRouter;