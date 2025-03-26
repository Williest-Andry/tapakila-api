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

    static async getAllEvents() {
        const query = `SELECT * FROM "event"`;
        const result = await pool.query(query);
        return result.rows;
    }

    static async getEventById(id) {
        const query = `SELECT * FROM "event" WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async createEvent({ title, description, date }) {
        const query = `
            INSERT INTO "event" (title, description, date)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const result = await pool.query(query, [title, description, date]);
        return result.rows[0];
    }

    static async updateEvent(id, { title, description, date }) {
        const query = `
            UPDATE "event" SET title = $1, description = $2, date = $3
            WHERE id = $4 RETURNING *;
        `;
        const result = await pool.query(query, [title, description, date, id]);
        return result.rows[0];
    }

    static async deleteEvent(id) {
        const query = `DELETE FROM "event" WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}
