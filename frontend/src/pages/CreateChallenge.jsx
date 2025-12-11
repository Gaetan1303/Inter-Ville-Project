import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallenges } from '../contexts/ChallengeContext';

export default function CreateChallenge() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Code');
  const [difficulty, setDifficulty] = useState('easy');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { createChallenge } = useChallenges();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        title,
        description,
        category,
        status: 'active',
        difficulty,
        start_date: startDate,
        end_date: endDate,
        created_by: 5,
      };
      const created = await createChallenge(payload);

      if (created && created.id) {
        setSuccess('Challenge créé avec succès !');
        // Reset form fields only on success
        setTitle('');
        setDescription('');
        setCategory('Code');
        setDifficulty('easy');
        setStartDate('');
        setEndDate('');
        navigate(`/Challenge/${created.id}`);
      } else {
        setError('Création échouée: identifiant manquant ou réponse invalide.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la création du challenge.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Créer un challenge</h2>
      <form onSubmit={handleSubmit} className="card">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <div className="row">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Code</option>
            <option>Sport</option>
            <option>Photo</option>
            <option>Cuisine</option>
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>
        <div className="row">
          <div>
            <label htmlFor="startDate">Date de début</label>
            <input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate">Date de fin</label>
            <input
              id="endDate"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Publication...' : 'Publier'}
        </button>
      </form>
    </div>
  );
}
