import express from "express";
import cors from "cors";
import pool from "./db.js";
import dayjs from "dayjs";
import user from "./routes/user.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use('/users', user);

app.get('/events/update', async (req, res) => {
  try {
    await pool.query("SELECT public.update_past_events()");
    res.json({ message: "Les événements passés ont été mis à jour" });

  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});


// EVENTS /!\

// get all events | filtered events
app.get('/events', async (req, res) => {
  const { title, order, page, perPage, sort } = req.query;

  try {
    let query = "SELECT * FROM event";
    let queryParams = [];

    if (title) {
      query += " WHERE title ILIKE $1";
      queryParams.push(`%${title}%`);
    }

    if (order && sort) {
      if (sort === 'availablePlace'){
        query += ` ORDER BY available_place ${order}`
      } else if (sort === 'dateTime') {
        query += ` ORDER BY date_time ${order}`;
      }
      else query += ` ORDER BY ${sort} ${order}`;
    }

    if (page && perPage){
      query += ` LIMIT ${perPage} OFFSET (${page} - 1) * ${perPage}`;
    }

    const result = await pool.query(query, queryParams);

    const events = result.rows.map((event) => ({
      id: event.id,
      image: "assets/events_image/" + event.image,
      title: event.title,
      dateTime: dayjs(event.date_time).format("YYYY-MM-DD HH:mm:ss"),
      location: event.location,
      category: event.category,
      availablePlace: event.available_place,
      description : event.description,
      organizer: event.organizer,
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
      category: event.category,
      availablePlace: event.available_place,
      description : event.description,
      organizer: event.organizer,
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
    const { id, image, title, dateTime, location, category, availablePlace, description, organizer } = req.body;

    const result = await pool.query(
      "INSERT INTO event (id, image, title, date_time, location, category, available_place, description, organizer) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [id, image, title, dateTime, location, category, availablePlace, description, organizer]
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
    const { image, title, dateTime, location, category, availablePlace, description, organizer } = req.body;

    const result = await pool.query(
      "UPDATE event SET image = $1, title = $2, date_time = $3, location = $4, category = $5, available_place = $6, description = $7, organizer = $8 WHERE id = $9 RETURNING *",
      [image, title, dateTime, location, category, availablePlace, description, organizer, id]
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
    const { order, page, perPage, sort } = req.query;

    let query = "SELECT * FROM ticket"

    if (order && sort) {
      if (sort === 'idEvent'){
        query += ` ORDER BY id_event ${order}`;
      } else if (sort === 'availableQuantity'){
        query += ` ORDER BY available_quantity ${order}`;
      }
      else query += ` ORDER BY ${sort} ${order}`;
    }

    if (page && perPage){
      query += ` LIMIT ${perPage} OFFSET (${page} - 1) * ${perPage}`;
    }

    const result = await pool.query(query);

    const tickets = result.rows.map((ticket) => ({
      id: ticket.id,
      idEvent: ticket.id_event,
      price: ticket.price,
      availableQuantity: ticket.available_quantity,
      type: ticket.type,
    }));

    res.json(tickets);
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

    const ticket = result.rows[0];

    const formattedTicket = {
      id: ticket.id,
      idEvent: ticket.id_event,
      price: ticket.price,
      availableQuantity: ticket.available_quantity,
      type: ticket.type,
    };

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Billet non trouvé" });
    }

    res.json(formattedTicket);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});

// add ticket
app.post("/tickets", async (req, res) => {
  try {
    const { idEvent, price, availableQuantity, type } = req.body;

    const result = await pool.query(
      "INSERT INTO ticket ( id_event, price, available_quantity, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [idEvent, price, availableQuantity, type]
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
    const { idEvent, price, availableQuantity, type } = req.body;

    const result = await pool.query(
      "UPDATE ticket SET event_id = $1, price = $2, available_quantity = $3, type = $4 WHERE id = $5 RETURNING *",
      [idEvent, price, availableQuantity, type, id]
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
    const result = await pool.query("SELECT * FROM ticket WHERE id_event = $1", [eventId]);

    const tickets = result.rows.map((ticket) => ({
      id: ticket.id,
      idEvent: ticket.id_event,
      price: ticket.price,
      availableQuantity: ticket.available_quantity,
      type: ticket.type,
    }));

    res.json(tickets);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});



// RESERVATIONS /!\

// get all reservations
app.get("/reservations", async (req, res) => {
  try {
    const { order, page, perPage, sort } = req.query;

    let query = "SELECT * FROM reservation";

    if (order && sort) {
      query += ` ORDER BY ${sort} ${order}`;
    }

    if (page && perPage){
      query += ` LIMIT ${perPage} OFFSET (${page} - 1) * ${perPage}`;
    }

    const result = await pool.query(query);

    const reservations = result.rows.map((reservation) => ({
      id: reservation.id,
      date_time: reservation.date_time,
      id_user: reservation.id_user,
      id_ticket: reservation.id_ticket,
      quantity: reservation.quantity,
    }));

    res.json(reservations);
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
    const { idUser, idTicket, quantity } = req.body;

    const result = await pool.query(
      "INSERT INTO reservation (date_time, id_user, id_ticket, quantity) VALUES (CURRENT_TIMESTAMP, $1, $2, $3) RETURNING *",
      [ idUser, idTicket, quantity ]
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
    const { idUser, idTicket, quantity } = req.body;

    const result = await pool.query(
      "UPDATE reservation SET user_id = $1, event_id = $2, quantity = $3 WHERE id = $4 RETURNING *",
      [idUser, idTicket, quantity, id]
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
  const { title } = req.query;

  try {
    const { userId } = req.params;

    const query = "SELECT r.id, r.id_user, r.id_ticket, e.title AS event_title, e.date_time AS event_date_time, e.location AS event_location, t.type AS ticket_type, r.quantity, r.date_time AS reservation_date_time FROM reservation r JOIN ticket t ON r.id_ticket = t.id JOIN event e ON t.id_event = e.id WHERE r.id_user = $1";
    let queryParams = [];
    queryParams.push(userId);

    if (title) {
      query += " AND e.title ILIKE $2";
      queryParams.push(`%${title}%`);
    }
    
    const result = await pool.query(query, queryParams);

    const reservations = result.rows.map((reservation) => ({
      id: reservation.id,
      idUser: reservation.id_user,
      idTicket: reservation.id_ticket,
      eventTitle: reservation.event_title,
      eventDateTime: dayjs(reservation.event_date_time).format("YYYY-MM-DD HH:mm:ss"),
      eventLocation: reservation.event_location,
      ticketType: reservation.ticket_type,
      quantity: reservation.quantity,
      reservationDateTime: dayjs(reservation.reservation_date_time).format("YYYY-MM-DD HH:mm:ss"),
    }));

    res.json(reservations);
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


// CATEGORY /!\
// get all categories
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT category FROM event ORDER BY category ASC");

    const categoryList = result.rows.map(({ category }) => ({
      label: category,
      value: category
    }));

    categoryList.unshift({ label: "All", value: "All" });

    res.json(categoryList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});


// LOCATIONS /!\
// get all locations
app.get("/locations", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT location FROM event ORDER BY location ASC");

    const locationList = result.rows.map(({ location }) => ({
      label: location,
      value: location
    }));

    locationList.unshift({ label: "All", value: "All" });

    res.json(locationList);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");
  }
});


const port = 3001;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})