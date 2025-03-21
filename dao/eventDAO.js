import pool from "../db.js";

export default class EventDAO {

    static async searchEventsByTitle(searchTerm) {
        if (!searchTerm) {
            throw new Error("Le terme de recherche ne peut pas être null");
        }

        const query = `
            SELECT * FROM "event"
            WHERE title ILIKE $1;
        `;
        
        const result = await pool.query(query, [`%${searchTerm}%`]);
        
        return result.rows;
    }
}
