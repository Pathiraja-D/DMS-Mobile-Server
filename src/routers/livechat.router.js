import { Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import {ChatMessageModel} from '../models/livechat.model.js';
import handler from 'express-async-handler';

const router = Router();

router.post('/send', handler(async (req, res) => {
    
        const {role, userName, message} = req.body;
    
        const newMessage = {
            role,
            userName,
            message,
        };
    
        try{
            const result = await ChatMessageModel.create(newMessage);
            res.send(true);
        } catch(error){
            res.status(BAD_REQUEST).send("Message send failed");
        }
}));









export default router;