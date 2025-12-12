import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChallenges } from '../contexts/ChallengeContext';
import CommentList from '../components/CommentList';

export default function ChallengePage() {
  const { id } = useParams();
  const { fetchChallengeById } = useChallenges();
  const [challenge, setChallenge] = useState(null);


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

  return (
    <div className="container">
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
