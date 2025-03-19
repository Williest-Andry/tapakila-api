export default class UserDAO {
    static async createUser(user) {
        const query = `
          INSERT INTO "user" (username, email, password, status) 
          VALUES ($1, $2, $3, $4) 
          RETURNING *;
        `;
        const values = [user.username, user.email, user.password, user.status];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
    
    static async findAllUsers() {
        const query = `SELECT * FROM "user";`;
        const result = await pool.query(query);
        return result.rows;
    }  

    static async findUser(email, password) {
        const query = `SELECT * FROM "user" WHERE email=$1 AND password=$2 RETURNING *;`;
        const result = await pool.query(query, [email, password]);
        return result.rows[0];
    }
}