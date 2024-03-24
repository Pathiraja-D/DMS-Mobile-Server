import { Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import {ChatMessageModel} from '../models/livechat.model.js';
import handler from 'express-async-handler';
import {v4 as uuidv4} from 'uuid';

const router = Router();

router.post('/send', handler(async (req, res) => {
    
        const {role, userName, message} = req.body;
    
        const newMessage = {
            messageId: uuidv4(),
            role,
            userName,
            message,
        };
    
        try{
            await ChatMessageModel.create(newMessage);
            res.send(true);
        } catch(error){
            res.status(BAD_REQUEST).send("Message send failed");
        }
}));









export default router;