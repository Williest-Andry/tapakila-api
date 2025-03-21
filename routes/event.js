import express from 'express';
import EventDAO from './../dao/eventDAO';
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
        console.error("Erreur lors de la recherche d'événements", error);
        return res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

export default router;
