import React from 'react';
import { Link } from 'react-router-dom';
import { useChallenges } from '../contexts/ChallengeContext';

export default function Home() {
  const { challenges } = useChallenges();
  const challengeActive = challenges?.filter((c) => c.status === 'active');
  const total = challengeActive?.length || 5;

  return (
    <div className="container">
      <section className="hero">
        <div>
          <span className="pill">Plateforme des défis de la promo</span>
          <h1>Inter-Ville: lance, relève et partage tes challenges.</h1>
          <p>
            Un espace pour publier des défis, inviter tes camarades et suivre les participations.
            Idéal pour l&apos;entraînement, les projets collectifs et les compétitions amicales.
          </p>
          <div className="hero-cta">
            <Link to="/Challenges">
              <button>Explorer les défis</button>
            </Link>
            <Link to="/create">
              <button className="ghost-btn">Créer un challenge</button>
            </Link>
          </div>
          <div className="badges">
            <span className="pill">Suivi des participations</span>
            <span className="pill">Commentaires et feedback</span>
            <span className="pill">Catégories variées</span>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom: 10 }}>
            <div className="card-head">
              <h3>Un coup d&apos;œil sur la communauté</h3>
              <span className="tag">Live</span>
            </div>
            <div className="stat-grid">
              <div className="stat">
                <strong>{total}</strong>
                <span className="muted">Challenges actifs</span>
              </div>
              <div className="stat">
                <strong>4.8/5</strong>
                <span className="muted">Engagement moyen</span>
              </div>
              <div className="stat">
                <strong>+15</strong>
                <span className="muted">Nouveaux défis / semaine</span>
              </div>
            </div>
          </div>
          <div className="mini-grid">
            <div className="mini-card">
              <strong>Défis rapides</strong>
              <p className="muted">Idées actionnables en moins de 30 minutes.</p>
            </div>
            <div className="mini-card">
              <strong>Projets fil rouge</strong>
              <p className="muted">Séries de challenges pour progresser chaque semaine.</p>
            </div>
            <div className="mini-card">
              <strong>Showcase</strong>
              <p className="muted">Publie tes réalisations et inspire la promo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-head">
          <h1>Comment ça marche ?</h1>
          <p className="muted">
            Trois étapes simples pour animer la communauté et garder la motivation.
          </p>
        </div>
        <div className="mini-grid">
          <div className="card">
            <span className="tag">1</span>
            <h3>Publie un challenge</h3>
            <p className="muted">
              Définis un titre, une description et la difficulté. Ajoute une catégorie pour que tes
              camarades le trouvent en un clin d&apos;œil.
            </p>
          </div>
          <div className="card">
            <span className="tag">2</span>
            <h3>Invites & participe</h3>
            <p className="muted">
              Participe toi-même ou propose le défi à ta promo. Suis qui s&apos;inscrit et échange
              dans les commentaires.
            </p>
          </div>
          <div className="card">
            <span className="tag">3</span>
            <h3>Recueille les retours</h3>
            <p className="muted">
              Les participants partagent leurs résultats et feedback. Tu peux affiner ou lancer une
              version plus avancée.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-head">
          <h1>Pourquoi Inter-Ville?</h1>
          <p className="muted">
            Une plateforme faite pour apprendre en faisant, tout en gardant une ambiance de promo
            soudée.
          </p>
        </div>
        <div className="mini-grid">
          <div className="mini-card">
            <strong>Entraînement ciblé</strong>
            <p className="muted">Code, design, sport, photo, cuisine : choisis ta voie.</p>
          </div>
          <div className="mini-card">
            <strong>Progression visible</strong>
            <p className="muted">Historique des défis créés et acceptés pour suivre ta courbe.</p>
          </div>
          <div className="mini-card">
            <strong>Émulation collective</strong>
            <p className="muted">Des défis courts pour garder le rythme et la motivation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
