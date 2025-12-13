import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChallenges } from '../contexts/ChallengeContext';
import { useAuth } from '../contexts/AuthContext';

export default function EditChallenge() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('code');
  const [difficulty, setDifficulty] = useState('easy');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { fetchChallengeById, updateChallenge,setChallenges,fetchChallenges } = useChallenges();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Charger le challenge existant
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const challenge = await fetchChallengeById(id);
        if (!challenge) {
          setError('Challenge introuvable');
          return;
        }
        // Verifier que l'utilisateur est le createur
        if (user && challenge.created_by !== user.id && user.role !== 'admin') {
          setError('Vous n\'etes pas autorise a modifier ce challenge');
          setTimeout(() => navigate('/profile'), 2000);
          return;
        }
        // Pre-remplir le formulaire
        setTitle(challenge.title || '');
        setDescription(challenge.description || '');
        setCategory(challenge.category || 'code');
        setDifficulty(challenge.difficulty || 'easy');
        // Formater les dates pour datetime-local
        if (challenge.start_date) {
          const start = new Date(challenge.start_date);
          setStartDate(start.toISOString().slice(0, 16));
        }
        if (challenge.end_date) {
          const end = new Date(challenge.end_date);
          setEndDate(end.toISOString().slice(0, 16));
        }
      } catch (err) {
        setError('Erreur lors du chargement du challenge');
      } finally {
        setLoading(false);
      }
    };
    loadChallenge();
  }, [id, user, fetchChallengeById, navigate]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('Connecte-toi pour modifier un challenge');
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        title,
        description,
        category,
        difficulty,
        start_date: startDate,
        end_date: endDate,
      };
      await updateChallenge(id, payload);
        //   setChallenges((prevChallenges) =>
        //     prevChallenges.map((challenge) =>
        //       challenge.id === parseInt(id, 10) ? { ...challenge, ...payload } : challenge
        //     )
        //   );    
     await fetchChallenges();  
      setSuccess('Challenge modifie avec succes !');
      setTimeout(() => navigate(`/Challenge/${id}`), 1500);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la modification du challenge.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p className="center">Chargement du challenge...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Modifier le challenge</h2>
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
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">-- Choisir une categorie --</option>
            <option value="code">Code</option>
            <option value="sport">Sport</option>
            <option value="design">Design</option>
            <option value="autre">Autre</option>
          </select>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required>
            <option value="">-- Choisir difficulte --</option>
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </div>
        <div className="row">
          <div>
            <label htmlFor="startDate">Date de debut</label>
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
        <div className="row">
          <button type="submit" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => navigate('/profile')}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
