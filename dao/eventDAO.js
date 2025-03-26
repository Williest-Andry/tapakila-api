import pool from "../db.js";
import Event from "../models/Event.js";

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
        
        return result.rows.map(row => new Event(
            row.id, 
            row.image, 
            row.title, 
            row.dateTime, 
            row.location, 
            row.category, 
            row.availablePlace
        ));
    }

    static async getAllEvents() {
        const query = `SELECT * FROM "event"`;
        const result = await pool.query(query);
        
        return result.rows.map(row => new Event(
            row.id, 
            row.image, 
            row.title, 
            row.datetime, 
            row.location, 
            row.category, 
            row.availablePlace
        ));
    }

    static async getEventById(id) {
        const query = `SELECT * FROM "event" WHERE id = $1`;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        const row = result.rows[0];
        return new Event(
            row.id, 
            row.image, 
            row.title, 
            row.dateTime, 
            row.location, 
            row.category, 
            row.availablePlace
        );
    }

    static async createEvent({ title, description, dateTime, image, location, category, availablePlace }) {
        const query = `
            INSERT INTO "event" (title, description, dateTime, image, location, category, availablePlace)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
        `;
        const result = await pool.query(query, [title, description, dateTime, image, location, category, availablePlace]);
        
        const row = result.rows[0];
        return new Event(
            row.id, 
            row.image, 
            row.title, 
            row.dateTime, 
            row.location, 
            row.category, 
            row.availablePlace
        );
    }

    static async updateEvent(id, { title, description, dateTime, image, location, category, availablePlace }) {
        const query = `
            UPDATE "event" SET title = $1, description = $2, dateTime = $3, image = $4, location = $5, category = $6, availablePlace = $7
            WHERE id = $8 RETURNING *;
        `;
        const result = await pool.query(query, [title, description, dateTime, image, location, category, availablePlace, id]);
        
        const row = result.rows[0];
        return new Event(
            row.id, 
            row.image, 
            row.title, 
            row.dateTime, 
            row.location, 
            row.category, 
            row.availablePlace
        );
    }

    static async deleteEvent(id) {
        const query = `DELETE FROM "event" WHERE id = $1 RETURNING *;`;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }

        const row = result.rows[0];
        return new Event(
            row.id, 
            row.image, 
            row.title, 
            row.dateTime, 
            row.location, 
            row.category, 
            row.availablePlace
        );
    }
}
