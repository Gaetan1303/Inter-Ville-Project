import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { useChallenges } from '../contexts/ChallengeContext';
import { useToastContext } from '../contexts/ToastContext';
import '../styles/Admin.css';

export default function Admin() {
  const {
    pendingUsers,
    loading,
    error,
    fetchPendingUsers,
    validateUser,
    deleteChallenge,
    fetchStats,
    stats,
  } = useAdmin();
  const { user } = useAuth();
  const { challenges, setChallenges } = useChallenges();
  const { showToast } = useToastContext();
  
  // État pour les onglets
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Log supprimé pour la production

  // État pour les commentaires
  const [comments] = useState([
    {
      id: 1,
      text: 'Super challenge !',
      challenge_id: 101,
      user_id: 2,
      created_at: '2025-12-11',
    },
    {
      id: 2,
      text: 'Trop difficile',
      challenge_id: 102,
      user_id: 3,
      created_at: '2025-12-10',
    },
    {
      id: 3,
      text: 'Merci pour ce défi intéressant',
      challenge_id: 103,
      user_id: 4,
      created_at: '2025-12-09',
    },
  ]);

  useEffect(() => {
    fetchStats();
  }, [challenges]);

  // Statistiques globales
  const stateGlobal = {
    utilisateurs: stats?.users ?? 0,
    challenges: stats?.challenges ?? 0,
    comments: stats?.comments ?? 0,
    pendingValidation: pendingUsers.length,
  };

  // fontion pour valider un utilisateur
  const handleValidateUser = async (userId) => {
    try {
      await validateUser(userId);
      showToast(`Utilisateur ${userId} validé avec succès !`, 'success');
    } catch (err) {
      showToast("Erreur lors de la validation de l'utilisateur.", 'error');
    }
  };

  // fonction pour supprimer un challenge
  const handleDeleteChallenge = async (challengeId) => {
    try {
      // Optimistic update: retire du tableau avant l'appel API
      const updatedChallenges = challenges?.filter((defi) => defi.id !== challengeId);
      setChallenges(updatedChallenges);

      // Appel API
      await deleteChallenge(challengeId);
      showToast(`Challenge ${challengeId} supprimé avec succès !`, 'success');
    } catch (error) {
      // En cas d'erreur, restaure la liste et affiche le message
      showToast('Erreur lors de la suppression du challenge.', 'error');
      // Optionnel: rafraîchis la liste depuis l'API
    }
  };

  const handleDeleteComment = (commentId) => {
    showToast(`Commentaire ${commentId} supprimé !`, 'success');
  };

  // Charger les utilisateurs en attente quand l'utilisateur connecté existe
  useEffect(() => {
    // Log supprimé pour la production

    if (user) {
      fetchPendingUsers();
    }
  }, [user]);

  return (
    <div className="admin-container">
      <h1>Dashboard Admin</h1>

      {/* Navigation par onglets */}
      <nav className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
           Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
           Utilisateurs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'challenges' ? 'active' : ''}`}
          onClick={() => setActiveTab('challenges')}
        >
           Challenges
        </button>
        <button 
          className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
          onClick={() => setActiveTab('comments')}
        >
           Commentaires
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
           Logs Kibana
        </button>
      </nav>

      {/* Contenu des onglets */}
      {activeTab === 'dashboard' && (
        <>
          {/* Statistiques globales */}
      <section className="stats-section">
        <h2>Statistiques Globales</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Utilisateurs</div>
            <div className="stat-value">{stateGlobal.utilisateurs}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Challenges</div>
            <div className="stat-value">{stateGlobal.challenges}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Commentaires</div>
            <div className="stat-value">{stateGlobal.comments}</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-label">En attente de validation</div>
            <div className="stat-value">{stateGlobal.pendingValidation}</div>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Onglet Utilisateurs */}
      {activeTab === 'users' && (
        <>
          {/* Gestion des utilisateurs en attente */}
      <section className="users-section">
        <h2>Comptes en Attente de Validation</h2>
        {error && <p className="empty-message">Erreur: {error}</p>}
        {loading && <p className="empty-message">Chargement des comptes en attente…</p>}
        {!loading && !user && (
          <p className="empty-message">Veuillez vous connecter pour accéder à cette section.</p>
        )}
        {!loading && user && user.role !== 'admin' && (
          <p className="empty-message">Accès réservé aux administrateurs.</p>
        )}
        {!loading && pendingUsers.length > 0 && user?.role === 'admin' ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Utilisateur</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.first_name} {user.last_name}
                  </td>
                  <td>{user.createdAt}</td>
                  <td>
                    <button
                      className="btn btn-validate"
                      onClick={() => handleValidateUser(user.id)}
                    >
                      Valider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !loading &&
          user?.role === 'admin' && (
            <div>
              <p className="empty-message">Aucun compte en attente de validation.</p>
              <button className="btn" onClick={fetchPendingUsers}>
                Rafraîchir
              </button>
            </div>
          )
        )}
      </section>
        </>
      )}

      {/* Onglet Challenges */}
      {activeTab === 'challenges' && (
        <>
          {/* Gestion des challenges */}
      <section className="challenges-section">
        <h2>Gestion des Challenges</h2>
        {challenges.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Catégorie</th>
                <th>Difficulté</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((challenge) => (
                <tr key={challenge.id}>
                  <td>{challenge.id}</td>
                  <td>{challenge.title}</td>
                  <td>{challenge.category}</td>
                  <td>
                    <span className={`difficulty difficulty-${challenge.difficulty}`}>
                      {challenge.difficulty}
                    </span>
                  </td>
                  <td>{challenge.status}</td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteChallenge(challenge.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">Aucun challenge trouvé.</p>
        )}
      </section>
        </>
      )}

      {/* Onglet Commentaires */}
      {activeTab === 'comments' && (
        <>
          {/* Gestion des commentaires */}
      <section className="comments-section">
        <h2>Gestion des Commentaires</h2>
        {comments.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Commentaire</th>
                <th>Challenge ID</th>
                <th>Utilisateur ID</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td className="comment-text">{comment.text}</td>
                  <td>{comment.challenge_id}</td>
                  <td>{comment.user_id}</td>
                  <td>{comment.created_at}</td>
                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">Aucun commentaire trouvé.</p>
        )}
      </section>
        </>
      )}

      {/* Onglet Logs Kibana */}
      {activeTab === 'logs' && (
        <section className="kibana-section">
          <div className="kibana-header">
            <h2>📈 Monitoring des Logs - Kibana</h2>
            <div className="kibana-actions">
              <a 
                href="/kibana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                 Ouvrir Kibana en plein écran
              </a>
              <button 
                className="btn btn-secondary"
                onClick={() => document.getElementById('kibana-iframe')?.contentWindow?.location.reload()}
              >
                 Actualiser
              </button>
            </div>
          </div>
          
          <div className="kibana-info">
            <div className="info-cards">
              <div className="info-card">
                <div className="info-label"> Dashboards disponibles</div>
                <div className="info-content">
                  <ul>
                    <li>Vue d'ensemble de l'application</li>
                    <li>Monitoring des erreurs</li>
                    <li>Performance des API</li>
                    <li>Activité des utilisateurs</li>
                  </ul>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-label">🔍 Index disponibles</div>
                <div className="info-content">
                  <p><strong>Pattern :</strong> inter-ville-*</p>
                  <p><strong>Services :</strong> Backend, Frontend</p>
                  <p><strong>Retention :</strong> 7 jours</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-label">⚡ Métriques temps réel</div>
                <div className="info-content">
                  <ul>
                    <li>Requêtes HTTP/min</li>
                    <li>Temps de réponse P95</li>
                    <li>Taux d'erreur</li>
                    <li>Logs par niveau</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="kibana-embed">
            <iframe
              id="kibana-iframe"
              src="/kibana/app/dashboards"
              title="Kibana Dashboard"
              className="kibana-iframe"
              frameBorder="0"
              allowFullScreen
            />
          </div>
          
          <div className="kibana-footer">
            <p className="help-text">
               <strong>Astuce :</strong> Utilisez les filtres temporels pour analyser différentes périodes. 
              Les logs sont automatiquement collectés depuis tous les services de l'application.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
