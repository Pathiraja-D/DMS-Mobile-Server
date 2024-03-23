import openai from '../config/bot.config.js';
import { Router } from "express";
const router = Router()

let conversationHostory = [];


router.post('/',async (req,res) => {
    const {role,content} = req.body;
    try{
        conversationHostory.push(["user","I developed a chat bot called DBOT and it is you. It is developed using flutter and node js backend using http package. If something is asked you have to answer anything related to that and you are the DBOT assistance.Do not provide harmfull content. Just happily help others by answering their questions as a virtual assistant DBOT."])
        const messages = conversationHostory.map(([role,content]) => ({role,content}));
        messages.push({role:role, content: content});
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            
        });
        const completionText = completion.choices[0].message.content;
        conversationHostory.push([role,content]);
        conversationHostory.push(["assistant",completionText]);
        res.status(200).send(completionText);


    }
    catch(err){
        res.status(500).send(err);
    }
});

export default router;