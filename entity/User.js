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
        this.#authToken = generatedAuthToken;
        return this.#authToken;
    }

    setId(id) {
        return this.#id = id;
    }

    setStatus(status){
        return this.#status = status;
    }

    setAuthToken(authToken){
        return this.#authToken = authToken;
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

    getAuthToken() {
        return this.#authToken;
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


// Suggestion d'une amelioration de la classe User (fourni par chatgpt)
/*
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

class User {
    #id;
    #password;
    #status;
    #authToken;

    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.#password = password;
        this.#id = randomUUID(); // Générer un ID unique
        this.#status = "active"; // Exemple de statut par défaut
    }

    getId() {
        return this.#id;
    }

    getStatus() {
        return this.#status;
    }

    async generateAuthToken() {
        const payload = { id: this.#id, email: this.email };
        this.#authToken = jwt.sign(payload, "secret", { expiresIn: "1h" }); // Durée limitée
        return this.#authToken;
    }
}
 */