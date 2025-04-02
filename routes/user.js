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
            req.body.password? req.body.password : req.user.password,
            req.body.birthday? req.body.birthday : req.user.birthday,
            req.body.phone? req.body.phone : req.user.phone,
            req.body.country? req.body.country : req.user.country,
            req.body.city? req.body.city : req.user.city
        );
        updatedUser.setId(req.user.id);
        await UserDAO.updateUser(updatedUser);
        const finalCreatedUser = updatedUser.toString();
        return res.send(finalCreatedUser);
    }
    catch(e){
        return res.status(400).send(e);
    }
});

user.delete('/myprofile', authentification, async(req, res) => {
    try{
        await UserDAO.deleteById(req.user.id);
        return res.send(req.user);
    }
    catch(e){
        return res.status(400).send(e);
    }
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
        res.status(404).send(e);
    }
});

// [IMPORTANT] For admin(ReactAdmin)
user.post('/admins', async (req, res) => {
    const sentUser = new User(
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.birthday,
        req.body.phone,
        req.body.country,
        req.body.city
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
            userObject.password,
            userObject.birthday,
            userObject.phone,
            userObject.country,
            userObject.city
        );
        createdUser.setId(userObject.id);
        createdUser.setStatus(userObject.status);
        createdUser.generateAuthToken();
        
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
        req.body.password,
        req.body.birthday,
        req.body.phone,
        req.body.country,
        req.body.city
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
            userObject.password,
            userObject.birthday,
            userObject.phone,
            userObject.country,
            userObject.city
        );
        createdUser.setId(userObject.id);
        createdUser.setStatus(userObject.status);
        createdUser.generateAuthToken();
        
        await UserDAO.save(createdUser);
        const finalCreatedUser = createdUser.toString();
        return res.status(201).send({ finalCreatedUser });
    }
    catch (e) {
        return res.status(400).send(e);
    }
});

user.post('/login', async (req, res) => {
    console.log(req.body);
    
    const email = await req.body.email;
    const password = await req.body.password;

    try {
        const verifiedUser = await UserDAO.findUser(email, password);

        if (!verifiedUser) {
            return res.status(404).send({message: "L'email et/ou le mot de passe est incorrect"});
        }

        const user = new User(
            verifiedUser.username,
            verifiedUser.email,
            verifiedUser.password,
            verifiedUser.birthday,
            verifiedUser.phone,
            verifiedUser.country,
            verifiedUser.city
        );
        user.setId(verifiedUser.id);
        user.setStatus(verifiedUser.status);


        const authToken = user.generateAuthToken();
        await UserDAO.save(user);
        const finalUser = user.toString()
        return res.send({ finalUser });
    }
    catch (e) {
        return res.status(400).send({error:e, message: "L'utilisateur n'existe pas" });
    }
});

user.post('/logout', authentification, async (req, res) => {
    try {
        const user = new User(
            req.user.username,
            req.user.email,
            req.user.password,
            req.user.birthday,
            req.user.phone,
            req.user.country,
            req.user.city
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
    const sendUser = req.body;

    try{
        if(req.user.status != 'admin'){
            return res.status(401).send("Route réservée aux admins!");
        }
        const foundUser = await UserDAO.findUserById(req.params.id);
        if(!foundUser){
            throw new Error();
        }
        if(Object.values(sendUser).some(prop => prop==null || prop=="")){
            throw new Error();
        }
        const updatedUser = new User(
            sendUser.username,
            sendUser.email,
            sendUser.password,
            sendUser.birthday,
            sendUser.phone,
            sendUser.country,
            sendUser.city
        );
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
    try{
        if(req.user.status != 'admin'){
            return res.status(401).send("Route réservée aux admins!");
        }
        if(!await UserDAO.findUserById(req.params.id)){
            throw new Error();
        }
        const deletedUser = await UserDAO.deleteById(req.params.id);
        return res.send(deletedUser);
    }
    catch(e){
        return res.status(400).send(e);
    }
});


export default user;