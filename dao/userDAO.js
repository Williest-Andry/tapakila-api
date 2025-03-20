import pool from "../db.js";

export default class UserDAO {
    static async save(user) {
        
        if (!await this.findUser(user.email, user.password)){
            console.log("ETO OO",user);
            const query = `
            INSERT INTO "user" (username, email, password, status) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
            `;
            const values = [user.username, user.email, user.getPassword(), user.getStatus()];
            const result = await pool.query(query, values);
            return result.rows[0];
        };
        
        const query = `UPDATE "user" SET authToken=$1 WHERE email=$2;`;
        const result = await pool.query(query, [user.authToken, user.email]);
        return result.rows[0];
    }

    static async findAllUsers() {
        const query = `SELECT * FROM "user";`;
        const result = await pool.query(query);
        return result.rows;
    }

    static async findUser(email, password) {
        const query = `SELECT * FROM "user" WHERE email=$1 AND password=$2;`;
        const result = await pool.query(query, [email, password]);
        return result.rows[0];
    }

    static async findUserById(id) {
        const query = `SELECT * FROM "user" WHERE id=$1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}