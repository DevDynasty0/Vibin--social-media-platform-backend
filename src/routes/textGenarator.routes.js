import axios from "axios";
import { Router } from "express";
// import modules from OpenAI library


const textGenaratorRouter = Router();

import OpenAI from "openai";
textGenaratorRouter.route("/genarate-caption").post(async (req, res) => {

    const {prompt} = req.body;
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });


    async function main() {
        const completion = await openai.chat.completions.create({
            messages: [{ "role": "user", "content": prompt }],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0].message.content);
        res.send({
            caption: completion.choices[0].message.content
        })
    }
    main();


})

export default textGenaratorRouter;
