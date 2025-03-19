import express from "express";
import cors from "cors";
import pool from "./db.js";
import dayjs from "dayjs";

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json("Hello World");
});


// EVENTS /!\

// get all events | filtered events
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

// get event by id
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

// add event
app.post("/events", async (req, res) => {
  try {
    const { id, image, title, dateTime, location, isAvailable, category } = req.body;

    const result = await pool.query(
      "INSERT INTO event (id, image, title, date_time, location, is_available, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [id, image, title, dateTime, location, isAvailable, category]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// update event
app.put("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, dateTime, location, isAvailable, category } = req.body;

    const result = await pool.query(
      "UPDATE event SET image = $1, title = $2, date_time = $3, location = $4, is_available = $5, category = $6 WHERE id = $7 RETURNING *",
      [image, title, dateTime, location, isAvailable, category, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// delete event
app.delete("/events/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM event WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }

    res.json({ message: "Événement supprimé" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});


// TICKETS /!\

// get all tickets
app.get("/tickets", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ticket");
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get ticket by id
app.get("/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM ticket WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Billet non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// add ticket
app.post("/tickets", async (req, res) => {
  try {
    const { id, eventId, userId, price, quantity } = req.body;

    const result = await pool.query(
      "INSERT INTO ticket (id, event_id, user_id, price, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, eventId, userId, price, quantity]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// update ticket
app.put("/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { eventId, userId, price, quantity } = req.body;

    const result = await pool.query(
      "UPDATE ticket SET event_id = $1, user_id = $2, price = $3, quantity = $4 WHERE id = $5 RETURNING *",
      [eventId, userId, price, quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Billet non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// delete ticket
app.delete("/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM ticket WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Billet non trouvé" });
    }

    res.json({ message: "Billet supprimé" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get tickets by event id
app.get("/events/:eventId/tickets", async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query("SELECT * FROM ticket WHERE event_id = $1", [eventId]);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get tickets by user id
app.get("/users/:userId/tickets", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query("SELECT * FROM ticket WHERE user_id = $1", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});


// RESERVATIONS /!\

// get all reservations
app.get("/reservations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservation");
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get reservation by id
app.get("/reservations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM reservation WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// add reservation
app.post("/reservations", async (req, res) => {
  try {
    const { id, userId, eventId, quantity, totalPrice } = req.body;

    const result = await pool.query(
      "INSERT INTO reservation (id, user_id, event_id, quantity, total_price) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, userId, eventId, quantity, totalPrice]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// update reservation
app.put("/reservations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, eventId, quantity, totalPrice } = req.body;

    const result = await pool.query(
      "UPDATE reservation SET user_id = $1, event_id = $2, quantity = $3, total_price = $4 WHERE id = $5 RETURNING *",
      [userId, eventId, quantity, totalPrice, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// delete reservation
app.delete("/reservations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM reservation WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Réservation non trouvée" });
    }

    res.json({ message: "Réservation supprimée" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get reservations by user id
app.get("/users/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query("SELECT * FROM reservation WHERE user_id = $1", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get reservations by event id
app.get("/events/:eventId/reservations", async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query("SELECT * FROM reservation WHERE event_id = $1", [eventId]);
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});


// USERS /!\

// get all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM user_account");
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get user by id
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM user_account WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// add user
app.post("/users", async (req, res) => {
  try {
    const { id, username, email, password, role } = req.body;

    const result = await pool.query(
      "INSERT INTO user_account (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, username, email, password, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// update user
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    const result = await pool.query(
      "UPDATE user_account SET username = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING *",
      [username, email, password, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM user_account WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// get user by email
app.get("/users/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const result = await pool.query("SELECT * FROM user_account WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});


const port = 3001;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})