import { Router } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { DisasterRequestModel } from "../models/disasterRequest.model.js";

const router = Router();

router.post('/request',handler(async (req,res) => {

    const {
        disasterType,
        disasterLocation,
        affectedCount,
        medicalNeed,
        otherNeeds} = req.body;

        const currentDateTime = new Date();
        const requestDate = currentDateTime.toDateString();
        const requestTime = currentDateTime.toTimeString();

        const newID = await generateRequestID(disasterType);

        const newRequest = {
            requestID: newID,
            disasterType,
            disasterLocation,
            affectedCount,
            medicalNeed,
            otherNeeds,
            requestDate,
            requestTime
        };

        const result = await DisasterRequestModel.create(newRequest);

        res.send(result);
}));

router.post('/getAll', handler(async(req, res) => {

    try{
        const allRequests = await DisasterRequestModel.find({}); //need to change accordingly
        res.send(allRequests);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
    }
}));

router.get('/getRequest/:requestID', handler(async(req, res) => {
        const { requestID } = req.params;
        console.log("requestID: ", requestID)

    try{
        const request = await DisasterRequestModel.findOne({requestID}); //need to change accordingly
        console.log("Request:",request);
        res.send(request);
    } catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
    }
}));



//need to change accordingly
const generateRequestID = async(disasterType) => {

    const disasterCode = disasterType.substring(0,2);
    const min = 0;
    const max = 100;
    const requestNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    const newID = disasterCode + requestNumber.toString();

    return newID;
};

export default router