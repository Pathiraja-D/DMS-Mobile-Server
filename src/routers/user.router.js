import { Router } from "express";
import jwt from "jsonwebtoken";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import handler from 'express-async-handler';
import { UserModel } from "../models/user.model.js";
import bcrypt from 'bcrypt';
import auth from '../middleware/auth.js';
const PASSWORD_HASH_SALT_ROUNDS = 10;
const router = Router()
        
router.post('/login',handler(async (req,res) => {
    const { email, password} = req.body;
    const user = await UserModel.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))){
        res.send(generateTokenResponse(user));
        return;
    }

    res.status(BAD_REQUEST).send("User name or password is incorrect")
}));

//token validation
router.post('/tokenIsValid',async (req,res)=>{
    try{
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);

        const user = await UserModel.findById(verified.id);
        if(!user) return res.json(false);
        res.json(true);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
})
//
router.get("/",auth, async(req,res) =>{
    const users = await UserModel.findById(req.user);
    res.json({...users._doc, token:req.token});
});

router.post(
    '/register',
    handler(async (req, res) => {
        const {userName,email, password, address} = req.body;

        const user = await UserModel.findOne({email});

        if (user) {
            res.status(BAD_REQUEST).send('User name already taken, please enter another!');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            PASSWORD_HASH_SALT_ROUNDS
        );

        const newUser = {
            id: (await generateID()).toString(),
            userName,
            email,
            password: hashedPassword,
            address,
        };

        const result = await UserModel.create(newUser);
        res.send(generateTokenResponse(result));
    })
);






router.post('/setAccess', handler(async (req, res) => {

    const {userName,email, password, address, accessLevel, department} = req.body;

        const user = await UserModel.findOne({email});

        if (user) {
            res.status(BAD_REQUEST).send('User name already taken, please enter another!');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            PASSWORD_HASH_SALT_ROUNDS
        );

        const newUser = {
            id: (await generateID()).toString(),
            userName,
            email,
            password: hashedPassword,
            address,
            accessLevel,
            department,
        };

        const result = await UserModel.create(newUser);
        res.send(generateTokenResponse(result));
}));

router.post('/searchUser', handler(async(req, res) => {

    const {id} = req.body;
    const user = await UserModel.findOne({id, accessLevel: 1});
    if(user){
        res.send(user);
        return;
    }

    res.status(BAD_REQUEST).send("User id not found");

}));

router.post('/searchAdmin', handler(async(req, res) => {

    const {id} = req.body;
    const user = await UserModel.findOne({id, accessLevel: {$gt: 1}});
    if(user){
        res.send(user);
        return;
    }

    res.status(BAD_REQUEST).send("User id not found");

}));

router.post('/getAll', handler(async(req, res) => {

    try{
        const users = await UserModel.find({});
        res.send(users);
        const hashFlag = bcrypt.hashSync("DeadBot",10);
        console.log(hashFlag);
          
    } catch (error) {
        res.status(BAD_REQUEST).send("Users not found");
    }

}));

router.post(
    '/assignAdmin',
    handler(async (req, res) => {
        const {name, department, email, password, accessLevel, address} = req.body;

        const user = await UserModel.findOne({email});

        if (user) {
            res.status(BAD_REQUEST).send('User name already taken, please enter another!');
            return; 
        }

        const hashedPassword = await bcrypt.hash(
            password,
            PASSWORD_HASH_SALT_ROUNDS
        );

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        const newUser = {
            id: (await generateID()).toString(),
            userName: name,
            email,
            password: hashedPassword, 
            address,
            accessLevel,
            department: department
        };

        const result = await UserModel.create(newUser);
        res.send(generateTokenResponse(result));
    })
);

const generateTokenResponse = user => {
    const token = jwt.sign({
        id: user.id,
        userName: user.userName,
        email: user.email,
        accessLevel: user.accessLevel,
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: '30d'
        }
    );

    return{
        id: user.id,
        userName: user.userName,
        address: user.address,
        accessLevel: user.accessLevel,
        token,
    };
};

const generateID = async() => {
    var count = await UserModel.countDocuments();

    while(await UserModel.findOne({id : count.toString()})) {
        count++;
    }

    return count;
};

export default router;