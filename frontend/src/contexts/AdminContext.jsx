import React, { createContext, useContext, useState } from 'react';
import API from '../api/axiosInstance';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Récupérer les utilisateurs en attente de validation
  const fetchPendingUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/admin/users/pending');
      console.log('GET /admin/users/pending ->', res.status, res.data);
      if (res.data.success) {
        setPendingUsers(res.data.data);
      }
      return res.data.data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Erreur inconnue';
      console.error('Erreur lors de la récupération des utilisateurs en attente:', msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Valider un utilisateur
  const validateUser = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/validate`);
      if (res.data.success) {
        // Retirer l'utilisateur validé de la liste des utilisateurs en attente
        setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
      }
      return res.data.data;
    } catch (err) {
      console.error("Erreur lors de la validation de l'utilisateur:", err);
      throw err;
    }
  };

  // Récupérer les statistiques globales
  const fetchStats = async () => {
    try {
      const res = await API.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
      return res.data;
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      throw err;
    }
  };

  // Supprimer un challenge
  const deleteChallenge = async (challengeId) => {
    try {
      const res = await API.delete(`/admin/challenges/${challengeId}`);
      return res.data;
    } catch (err) {
      console.error('Erreur lors de la suppression du challenge:', err);
      throw err;
    }
  };

  // Supprimer un commentaire
  const deleteComment = async (commentId) => {
    try {
      const res = await API.delete(`/admin/comments/${commentId}`);
      return res.data;
    } catch (err) {
      console.error('Erreur lors de la suppression du commentaire:', err);
      throw err;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        pendingUsers,
        stats,
        loading,
        error,
        fetchPendingUsers,
        validateUser,
        fetchStats,
        deleteChallenge,
        deleteComment,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
