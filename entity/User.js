import jwt from 'jsonwebtoken';

export default class User {
    #id;
    #password;
    #status;
    #authToken;

    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.#password = password;
    }

    async generateAuthToken() {
        const generatedAuthToken = jwt.sign({ id: this.#id, email: this.email, password: this.#password }, 'secret');
        this.authToken = generatedAuthToken;
        return this.authToken;
    }

    setId(id) {
        return this.#id = id;
    }

    setStatus(status){
        return this.#status = status;
    }

    getId(){
        return this.#id;
    }
    
    getStatus() {
        return this.#status;
    }

    getPassword() {
        return this.#password;
    }

    toString(){
        return {
            id: this.#id,
            username: this.username,
            email: this.email,
            passoword: this.#password,
            status: this.#status,
            authToken: this.#authToken
        }
    }
}

// const test = new User("test", "test@gmail.com", "aljsdlfalksdfk");
// console.log("ito le izy",test.toString());
// console.log(test.password);

