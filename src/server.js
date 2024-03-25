import dotenv from 'dotenv';
import http from 'http';
import express from "express";
import cors from 'cors';
import userRouter from './routers/user.router.js';
import disasterRequestRouter from './routers/request.router.js'
import newsRouter from './routers/news.router.js';
import botRouter from './routers/chat.router.js';
import liveChatRouter from './routers/livechat.router.js';
import dbconnect from './config/database.config.js';
import {Server} from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json());

app.use(cors({
    credentials:true,
    origin: ['http://localhost:5173'],
    })
);

app.use('/api/users',userRouter);
app.use('/api/requests',disasterRequestRouter);
app.use('/api/news',newsRouter);
app.use('/api/chatbot',botRouter);
app.use('/api/livechat',liveChatRouter);
//app.use('/api/reports', disasterReportRouter);

dbconnect(io);

io.on('connection', (socket) => {
    console.log("Websocket connection established");

socket.on('chat message', (msg) => {
    console.log('message: ' + msg);});

socket.on('disconnect', () => {
    console.log('Websocket disconnected');
});


});

const PORT = 5000;
server.listen(PORT,/*0.0.0.0"*/() =>{
    console.log('listening on port '+ PORT);
})