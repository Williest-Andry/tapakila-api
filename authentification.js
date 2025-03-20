import jwt from 'jsonwebtoken';
import UserDAO from './dao/userDAO.js';

export default async function authentification (req, res, next) {
    
    try{
        const authToken = req.header('Authorization').replace('Bearer ','');
        const decodedToken = jwt.verify(authToken, 'secret');
        const user = await UserDAO.findUserByIdAndToken(decodedToken.id, authToken);
        
        if(!user){
            throw new Error();
        }

        req.user = user;
        next();
    }
    catch(e){
        res.status(401).send("Veuillez vous authentifier!")
    }
}