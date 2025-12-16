import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChallenges } from '../contexts/ChallengeContext';
import { useAuth } from '../contexts/AuthContext';
import { useParticipation } from '../contexts/ParticipationContext';
import CommentList from '../components/CommentList';

export default function ChallengePage() {
  const { id } = useParams();
  const { fetchChallengeById } = useChallenges();
  const { user } = useAuth();
  const { createParticipation, getChallengeParticipations, loading } = useParticipation();
  const [challenge, setChallenge] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);

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
      // Charger le challenge
      const data = await fetchChallengeById(id);
      setChallenge(data);
      
      // Charger les participations
      const participants = await getChallengeParticipations(id);
      setParticipantCount(participants.length);
      
      // Verifier si l'utilisateur participe deja
      if (user) {
        const userParticipates = participants.some((p) => p.user_id === user.id);
        setIsParticipating(userParticipates);
      }
    } catch {
      console.error('Erreur lors du chargement du défi.');
    }
  };

  // Handler pour participer au challenge
  const handleParticipate = async () => {
    if (!user) {
      alert('Connecte-toi pour participer a ce challenge');
      return;
    }
    if (isParticipating) {
      alert('Tu participes deja a ce challenge !');
      return;
    }
    try {
      await createParticipation(id, user.id);
      setIsParticipating(true);
      setParticipantCount((prev) => prev + 1);
      alert('Participation enregistree avec succes !');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la participation';
      alert(msg);
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

    

        <div style={{ marginTop: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={handleParticipate} 
            disabled={loading || isParticipating}
            style={{ opacity: isParticipating ? 0.6 : 1 }}
          >
            {isParticipating ? 'Deja inscrit' : 'Participer'}
          </button>
          <span className="muted">{participantCount} participant{participantCount > 1 ? 's' : ''}</span>
        </div>
      </article>

     

      <section style={{ marginTop: '20px' }}>
        <h3>Commentaires</h3>
        <CommentList challengeId={id} />
      </section>
    </div>
  );
}
