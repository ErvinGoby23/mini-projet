import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }
});

app.get('/restaurants', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM restaurants');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.post('/restaurants', async (req, res, next) => {
  try {
    const { nom, adresse, note } = req.body;
    const [result] = await pool.query(
      'INSERT INTO restaurants (nom, adresse, note) VALUES (?, ?, ?)',
      [nom, adresse, note]
    );
    res.json({ id: result.insertId, nom, adresse, note });
  } catch (err) {
    next(err);
  }
});

app.put('/restaurants/:id', async (req, res, next) => {
  try {
    const { nom, adresse, note } = req.body;
    const { id } = req.params;
    await pool.query(
      'UPDATE restaurants SET nom = ?, adresse = ?, note = ? WHERE id = ?',
      [nom, adresse, note, id]
    );
    res.json({ id, nom, adresse, note });
  } catch (err) {
    next(err);
  }
});

app.delete('/restaurants/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM restaurants WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error('Erreur :', err);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log('Adresse IP du serveur :', require('os').networkInterfaces());
});