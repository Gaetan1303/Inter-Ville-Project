import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Admin.css';

export default function Admin() {
  const { pendingUsers, loading, error, fetchPendingUsers, validateUser } = useAdmin();
  const { user } = useAuth();
  console.log(pendingUsers, 'pendingUsers');

  // État pour les challenges
  const [challenges] = useState([
    {
      id: 101,
      title: 'Challenge Code Avancé',
      created_by: 5,
      category: 'Code',
      difficulty: 'hard',
      status: 'active',
    },
    {
      id: 102,
      title: 'Photo Challenge',
      created_by: 7,
      category: 'Photo',
      difficulty: 'medium',
      status: 'active',
    },
    {
      id: 103,
      title: 'Défi Culinaire',
      created_by: 8,
      category: 'Cuisine',
      difficulty: 'easy',
      status: 'completed',
    },
  ]);

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

  // Statistiques globales
  const stats = {
    users: 45,
    challenges: 12,
    comments: 87,
    pendingValidation: pendingUsers.length,
  };

  // Handlers
  const handleValidateUser = async (userId) => {
    try {
      await validateUser(userId);
      alert(`Utilisateur ${userId} validé avec succès !`);
    } catch (err) {
      alert("Erreur lors de la validation de l'utilisateur.");
    }
  };

  const handleDeleteChallenge = (challengeId) => {
    alert(
      `Challenge ${challengeId} supprimé ! (Appel API: DELETE /admin/challenges/${challengeId})`
    );
  };

  const handleDeleteComment = (commentId) => {
    alert(`Commentaire ${commentId} supprimé ! (Appel API: DELETE /admin/comments/${commentId})`);
  };

  // Charger les utilisateurs en attente quand l'utilisateur connecté existe
  useEffect(() => {
    console.log('Current user in Admin page:', user);

    if (user) {
      fetchPendingUsers();
    }
  }, [user]);

  return (
    <div className="admin-container">
      <h1>Dashboard Admin</h1>

      {/* Statistiques globales */}
      <section className="stats-section">
        <h2>Statistiques Globales</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Utilisateurs</div>
            <div className="stat-value">{stats.users}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Challenges</div>
            <div className="stat-value">{stats.challenges}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Commentaires</div>
            <div className="stat-value">{stats.comments}</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-label">En attente de validation</div>
            <div className="stat-value">{stats.pendingValidation}</div>
          </div>
        </div>
      </section>

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
    </div>
  );
}
