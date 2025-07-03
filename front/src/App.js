import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL ;

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ nom: '', adresse: '', note: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const res = await axios.get(`${API_URL}/restaurants`);
    setRestaurants(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/restaurants/${editing.id}`, form);
      setEditing(null);
    } else {
      await axios.post(`${API_URL}/restaurants`, form);
    }
    setForm({ nom: '', adresse: '', note: '' });
    fetchRestaurants();
  };

  const handleEdit = (restaurant) => {
    setForm({
      nom: restaurant.nom,
      adresse: restaurant.adresse,
      note: restaurant.note,
    });
    setEditing(restaurant);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/restaurants/${id}`);
    fetchRestaurants();
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Gestion des restaurants</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          placeholder="Nom"
          required
        />
        <input
          type="text"
          value={form.adresse}
          onChange={(e) => setForm({ ...form, adresse: e.target.value })}
          placeholder="Adresse"
          required
        />
        <input
          type="number"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Note (0-5)"
          min="0"
          max="5"
          required
        />
        <button type="submit">{editing ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <ul className="list">
        {restaurants.map((r) => (
          <li key={r.id} className="item">
            <div className="info">
              <strong>{r.nom}</strong> — {r.adresse} — Note : {r.note}/5
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(r)} className="edit-btn">
                Modifier
              </button>
              <button onClick={() => handleDelete(r.id)} className="delete-btn">
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
