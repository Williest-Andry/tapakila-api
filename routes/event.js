import express from 'express';
import EventDAO from './../dao/eventDAO.js';

const router = express.Router();

router.get('/search-events', async (req, res) => {
    const searchTerm = req.query.query;
    if (!searchTerm) {
        return res.status(400).json({ message: "Le terme de recherche est requis." });
    }

    try {
        const events = await EventDAO.searchEventsByTitle(searchTerm);
        return res.json(events);
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

router.get('/events', async (req, res) => {
    try {
        const events = await EventDAO.getAllEvents();
        const formattedEvents = events.map(event => ({
            ...event,
            dateTime: new Date(event.dateTime).toISOString(),
        }));

        return res.json(formattedEvents);
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

router.post('/events', async (req, res) => {
    const { title, description, dateTime, image, location, category, availablePlace } = req.body;
    if (!title || !description || !dateTime || !image || !location || !category || availablePlace === undefined) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    try {
        const newEvent = await EventDAO.createEvent({
            title,
            description,
            dateTime: new Date(dateTime).toISOString(),
            image,
            location,
            category,
            availablePlace,
        });
        return res.status(201).json(newEvent);
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

router.put('/events/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, dateTime, image, location, category, availablePlace } = req.body;

    try {
        const updatedEvent = await EventDAO.updateEvent(id, {
            title,
            description,
            dateTime: new Date(dateTime),
            image,
            location,
            category,
            availablePlace,
        });

        if (!updatedEvent) {
            return res.status(404).json({ message: "Événement non trouvé." });
        }
        return res.json(updatedEvent);
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

router.delete('/events/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEvent = await EventDAO.deleteEvent(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Événement non trouvé." });
        }
        return res.json({ message: "Événement supprimé avec succès." });
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

export default router;
