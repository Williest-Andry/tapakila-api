import jwt from 'jsonwebtoken';

export default class User {
    constructor(id, userName, email, password, status){
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.status = status;
    }

   async generateAuthTokenAndSaveUser(){
       const authToken = jwt.sign({id: this.id.toString()}, 'secret'); 
        
   }
}
