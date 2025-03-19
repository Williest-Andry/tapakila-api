import express from 'express';
import UserDAO from '../dao/userDAO';

const user = express.Router();

user.get('/', async(req, res) => {
    res.json("Users page");
});

user.post('/', async (req, res) => {
    const user = await req.body;

    try{
        const createdUser = UserDAO.createUser(user);
        res.status(201).send(createdUser);
    }
    catch(e){
        res.status(400).send(e);
    }
})

user.post('/login', async (req, res) => {
    try {
        const user = await UserDAO.findUser(req.body.email, req.body.password);
        res.send(user);
    }
    catch(e){
        res.status(400).send(e);
    }
})

export default user;