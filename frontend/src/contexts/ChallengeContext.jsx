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


  // fonction pour récupérer les commentaires d'un défi
   const fetchComments = async (challengeId) => {
    // /comments/challenge/${challengeId}
    try {
      const res = await API.get(`/comments/challenge/${challengeId}`);
      return res.data;
    } catch (err) {
      console.error('Erreur lors de la récupération des commentaires.', err);
    }
  };

// fonction pour poster un commentaire
   const postComment = async ({
    challengeId,    
    content,
    parent_id,
    user_id,
  }) => {
    try {
      const res = await API.post("/comments", {
        challenge_id: challengeId,        
        content,
        parent_id: parent_id || null,
        user_id,
      });
      return res.data;
    } catch (err) {
      console.error("Erreur lors de la publication du commentaire.", err);
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
        fetchComments,
        postComment,
        
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => useContext(ChallengeContext);
