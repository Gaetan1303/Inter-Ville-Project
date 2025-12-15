import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChallenges } from '../contexts/ChallengeContext';
import CommentList from '../components/CommentList';

export default function ChallengePage() {
  const { id } = useParams();
  const { fetchChallengeById } = useChallenges();
  const [challenge, setChallenge] = useState(null);

  // Utilitaires pour afficher la progression entre start/end
  const computeProgress = (startDate, endDate) => {
    if (!startDate || !endDate) return { percent: 0, label: 'Dates non définies' };
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      return { percent: 0, label: 'Dates invalides' };
    }
    const percent = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
    const label = now < start ? 'À venir' : now > end ? 'Terminé' : 'En cours';
    return { percent, label };
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };


  // appel de la fonction fetchChallengeById du contexte a chaque changement d'id
  useEffect(() => {
    load();
  }, [id]);

  
  const load = async () => {
    try {
      // appel de la fonction fetchChallengeById du contexte
      const data = await fetchChallengeById(id);
      setChallenge(data);
    } catch {
      console.error('Erreur lors du chargement du défi.');
    }
  };

  if (!challenge) return <div className="center">Chargement défi...</div>;

  const { percent, label } = computeProgress(challenge.start_date, challenge.end_date);

  return (
    <div className="container">

      {/* Timeline du défi */}
       <div className="timeline-card">
          <div className="timeline-head">
            <div>
              <div className="muted">Début</div>
              <strong>{formatDate(challenge.start_date)}</strong>
            </div>
            <div className="timeline-status">{label}</div>
            <div style={{ textAlign: 'right' }}>
              <div className="muted">Fin</div>
              <strong>{formatDate(challenge.end_date)}</strong>
            </div>
          </div>
          <div className="progress-shell">
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="progress-meta">
            <span>{Math.round(percent)}%</span>
            <span className="muted">{label}</span>
          </div>
        </div>
      <article className="detail">
        <h2>{challenge.title}</h2>
        <div className="meta">
          {challenge.category} • {challenge.difficulty} • Posté par{' '}
          {challenge.author?.pseudo || 'Anonyme'}
        </div>
        <p>{challenge.description}</p>
        {challenge.image && (
          <img src={challenge.image} alt="illustration" className="detail-image" />
        )}

    

        <div style={{ marginTop: '12px' }}>
          <button>Participer</button>
        </div>
      </article>

     

      <section style={{ marginTop: '20px' }}>
        <h3>Commentaires</h3>
        <CommentList challengeId={id} />
      </section>
    </div>
  );
}
