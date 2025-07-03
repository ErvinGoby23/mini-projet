import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [form, setForm] = useState({ nom: '', adresse: '', note: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${API_URL}/restaurants`);
      setRestaurants(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des restaurants :', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { nom, adresse, note } = form;
      const noteValue = parseFloat(note);
      if (noteValue < 0 || noteValue > 5) {
        alert('Note invalide (doit être entre 0 et 5)');
        return;
      }

      if (editing) {
        await axios.put(`${API_URL}/restaurants/${editing.id}`, { nom, adresse, note: noteValue });
        setEditing(null);
      } else {
        await axios.post(`${API_URL}/restaurants`, { nom, adresse, note: noteValue });
      }

      setForm({ nom: '', adresse: '', note: '' });
      fetchRestaurants();
    } catch (error) {
      console.error('Erreur lors de l’envoi du formulaire :', error);
    }
  };

  const handleEdit = (restaurant) => {
    setForm({
      nom: restaurant.nom,
      adresse: restaurant.adresse,
      note: restaurant.note.toString(),
    });
    setEditing(restaurant);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
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
