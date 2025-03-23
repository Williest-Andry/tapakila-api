import pool from "../db.js";

export default class UserDAO {
    static async save(user) {
        if (!await this.findUser(user.email, user.getPassword())) {
            const query = `
            INSERT INTO "user" (username, email, password, status, authtoken) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *;
            `;
            const values = [user.username, user.email, user.getPassword(), user.getStatus(), user.getAuthToken()];
            const result = await pool.query(query, values);
            
            return result.rows[0];
        }

        const query = `UPDATE "user" SET authToken=$1 WHERE id=$2;`;
        const result = await pool.query(query, [user.getAuthToken(), user.getId()]);
        return result.rows[0];
    }

    static async updateUser(user){
        if(!await this.findUserById(user.getId())){
            return this.save(user);
        }
        const query = `UPDATE "user" SET username=$1, email=$2, password=$3 WHERE id=$4;`;
        const values = [user.username, user.email, user.getPassword(), user.getId()];
        const result = await pool.query(query, values);
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
        if (isNaN(id)) {
            throw new Error("L'ID doit être un entier valide !");
        }
        const query = `SELECT * FROM "user" WHERE id=$1;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findUserByIdAndToken(id, authToken) {
        const query = `SELECT * FROM "user" WHERE id=$1 AND authToken='${authToken}';`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async deleteById(id){
        const query = `DELETE FROM "user" WHERE id=$1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}