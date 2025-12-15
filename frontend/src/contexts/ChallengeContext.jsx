import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axiosInstance';

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  // recuperer les défis depuis l'API
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await API.get('/challenges');
      setChallenges(res.data.data);
    } catch (err) {
      console.error('erreur lors de récupération des défis.', err);
    } finally {
      setLoading(false);
    }
  };
  // charger les défis au montage du composant
  useEffect(() => {
    fetchChallenges();
  }, []);


  // fonction pour créer un nouveau défi
  const createChallenge = async (payload) => {
    try {
      const res = await API.post('/challenges', payload);
      setChallenges((prev) => [res.data.data, ...prev]);
      return res.data.data;
    } catch (err) {
      console.error('Erreur lors de la création du défi.', err);
      throw err;
    }
  };


  // fonction pour récupérer un défi par son ID
  const fetchChallengeById = async (id) => {
    try {
      const res = await API.get(`/challenges/${id}`);
      return res.data.data;
    } catch (err) {
      console.error('Erreur lors de la récupération du défi.', err);
      throw err;
    }
  };

  // fonction pour modifier un défi existant
  const updateChallenge = async (id, payload) => {
    try {
      const res = await API.put(`/challenges/${id}`, payload);
      // Mettre à jour la liste locale des défis
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? res.data.data : c))
      );
      return res.data.data;
    } catch (err) {
      console.error('Erreur lors de la modification du défi.', err);
      throw err;
    }
  };

  // fonction pour supprimer un défi
  const deleteChallenge = async (id) => {
    try {
      await API.delete(`/challenges/${id}`);
      // Retirer le défi de la liste locale
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du défi.', err);
      throw err;
    }
  };

 
  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        setChallenges,
        loading,
        fetchChallenges,
        createChallenge,
        fetchChallengeById,       
        updateChallenge,
        deleteChallenge,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => useContext(ChallengeContext);
