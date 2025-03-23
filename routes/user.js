import express from 'express';
import UserDAO from '../dao/userDAO.js';
import User from '../entity/User.js';
import authentification from '../authentification.js';

const user = express.Router();

user.get('/myprofile', authentification, async (req, res) => {
    res.send(req.user);
});

user.put('/myprofile', authentification, async(req, res) => {
    try{
        const updatedUser = new User(
            req.body.username?  req.body.username : req.user.username,
            req.body.email? req.body.email : req.user.email,
            req.body.password? req.body.password : req.user.password
        );
        updatedUser.setId(req.user.id);
        console.log("ato");
        await UserDAO.updateUser(updatedUser);
        const finalCreatedUser = updatedUser.toString();
        return res.send(finalCreatedUser);
    }
    catch(e){
        return res.status(400).send(e);
    }
});

user.delete('/myprofile', authentification, async(req, res) => {

});

// [IMPORTANT] For admin(ReactAdmin)
user.get('/', authentification, async (req, res) => {
    try {
        if(req.user.status != 'admin'){
            return res.status(401).send("Route réservée aux admins!");
        }
        const users = await UserDAO.findAllUsers();
        if (!users) {
            return res.status(404).send("La liste d'utilisateur n'est pas disponible");
        }
        res.send(users);
    }
    catch (e) {
        res.status(404).send(e);
    }
});

// [IMPORTANT] For admin(ReactAdmin)
user.get('/:id', authentification, async (req, res) => {
    try {
        if(req.user.status != 'admin'){
            return res.status(401).send("Route réservée aux admins!");
        }
        const user = await UserDAO.findUserById(parseInt(req.params.id));
        if (!user) {
            return res.status(404).send("Cet utilisateur n'existe pas")
        }
        res.send(user);
    }
    catch (e) {
        res.status(404).send("haha");
    }
});

// [IMPORTANT] For admin(ReactAdmin)
user.post('/admins', async (req, res) => {
    const sentUser = new User(
        req.body.username,
        req.body.email,
        req.body.password
    );
    sentUser.setStatus('admin');

    try {
        if (await UserDAO.findUser(req.body.email, req.body.password)) {
            return res.send("L'email : " + req.body.email + " et/ou le nom : " + req.body.username + " est déjà liée à un compte");
        }
        
        const userObject = await UserDAO.save(sentUser);

        const createdUser = new User(
            userObject.username,
            userObject.email,
            userObject.password
        );
        createdUser.setId(userObject.id);
        createdUser.setStatus(userObject.status);
        const authToken = createdUser.generateAuthToken();
        
        await UserDAO.save(createdUser);
        const finalCreatedUser = createdUser.toString();
        return res.status(201).send({ finalCreatedUser });
    }
    catch (e) {
        return res.status(400).send(e);
    }
});

user.post('/', async (req, res) => {
    const sentUser = new User(
        req.body.username,
        req.body.email,
        req.body.password
    );
    sentUser.setStatus('user');

    try {
        if (await UserDAO.findUser(req.body.email, req.body.password)) {
            return res.send("L'email : " + req.body.email + " et/ou le nom : " + req.body.username + " est déjà liée à un compte");
        }

        const userObject = await UserDAO.save(sentUser);

        const createdUser = new User(
            userObject.username,
            userObject.email,
            userObject.password
        );
        createdUser.setId(userObject.id);
        createdUser.setStatus(userObject.status);
        const authToken = createdUser.generateAuthToken();
        
        await UserDAO.save(createdUser);
        const finalCreatedUser = createdUser.toString();
        return res.status(201).send({ finalCreatedUser });
    }
    catch (e) {
        return res.status(400).send(e);
    }
});

user.post('/login', async (req, res) => {
    const email = await req.body.email;
    const password = await req.body.password;

    try {
        const verifiedUser = await UserDAO.findUser(email, password);

        if (!verifiedUser) {
            return res.status(404).send("L'email et/ou le mot de passe est incorrect");
        }

        const user = new User(
            verifiedUser.username,
            verifiedUser.email,
            verifiedUser.password,
        );
        user.setId(verifiedUser.id);
        user.setStatus(verifiedUser.status);


        const authToken = user.generateAuthToken();
        await UserDAO.save(user);
        const finalUser = user.toString()
        return res.send({ finalUser });
    }
    catch (e) {
        return res.status(400).send(e);
    }
});

user.post('/logout', authentification, async (req, res) => {
    try {
        const user = new User(
            req.user.username,
            req.user.email,
            req.user.password
        );
        user.setId(req.user.id);
        user.setAuthToken(null);

        await UserDAO.save(user);
        res.send(user)
    }
    catch (e) {
        res.status(500).send(e);
    }
});

// [IMPORTANT] For admin(ReactAdmin)
user.put('/:id', authentification, async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    try{
        if(req.user.status != 'admin'){
            return res.status(401).send("Route réservée aux admins!");
        }
        const foundUser = await UserDAO.findUserById(req.params.id);
        if(!foundUser){
            throw new Error();
        }
        if(username==null || email ==null || password==null){
            throw new Error();
        }
        const updatedUser = new User(username,email,password);
        updatedUser.setId(foundUser.id);
        await UserDAO.updateUser(updatedUser);
        const finalCreatedUser = updatedUser.toString();
        return res.send(finalCreatedUser);
    }
    catch(e){
        return res.status(400).send(e);
    }
});

// [IMPORTANT] For admin(ReactAdmin)
user.delete('/:id', authentification, async(req, res) => {

});


export default user;