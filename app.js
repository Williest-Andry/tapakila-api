import express from "express";
import pool from "./db.js";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json("Hello World")
});

app.get('/ingredient', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ingredient");
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Erreur serveur");   
  }
});

const port = 3001;

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})