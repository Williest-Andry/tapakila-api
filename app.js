import express from "express";
import cors from "cors";
import pool from "./db.js";
import dayjs from "dayjs";
import user from "./routes/user.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use('/users', user);

app.get('/', (req, res) => {
    res.json("Hello World");
});

app.get('/events', async (req, res) => {
  const { title } = req.query;

  try {
    let query = "SELECT * FROM event";
    let queryParams = [];

    if (title) {
      query += " WHERE title ILIKE $1";
      queryParams.push(`%${title}%`);
    }

    const result = await pool.query(query, queryParams);

    const events = result.rows.map((event) => ({
      id: event.id,
      image: "assets/events_image/" + event.image,
      title: event.title,
      dateTime: dayjs(event.date_time).format("YYYY-MM-DD HH:mm:ss"),
      location: event.location,
      isAvailable: Boolean(event.is_available),
      category: event.category,
    }));

    res.json(events);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

app.get("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM event WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    const event = result.rows[0];

    const formattedEvent = {
      id: event.id,
      image: "assets/events_image/" + event.image,
      title: event.title,
      dateTime: dayjs(event.date_time).format("YYYY-MM-DD HH:mm:ss"),
      location: event.location,
      isAvailable: Boolean(event.is_available),
      category: event.category,
    };

    res.json(formattedEvent);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})