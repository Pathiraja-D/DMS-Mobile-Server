import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from 'cors';
import userRouter from './routers/user.router.js';
import disasterRequestRouter from './routers/request.router.js'
import newsRouter from './routers/news.router.js';
//import disasterReportRouter from './routers/report.router.js'

import {dbconnect} from './config/database.config.js';

dbconnect();



const app = express();
app.use(express.json());

app.use(cors({
    credentials:true,
    origin: ['http://localhost:5173'],
    })
);

app.use('/api/users',userRouter);
app.use('/api/requests',disasterRequestRouter);
app.use('/api/news',newsRouter);
//app.use('/api/reports', disasterReportRouter);

const PORT = 5000;
app.listen(PORT,"0.0.0.0",() =>{
    console.log('listening on port '+ PORT);
})