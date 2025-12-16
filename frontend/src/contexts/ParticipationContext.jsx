import React, { createContext, useContext, useState } from 'react';
import API from '../api/axiosInstance';

const ParticipationContext = createContext();

export const ParticipationProvider = ({ children }) => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fonction pour participer a un challenge
  const createParticipation = async (challengeId, userId) => {
    try {
      setLoading(true);
      const res = await API.post(`/participations/${challengeId}`, {
        user_id: userId,
        challenge_id: challengeId,
      });
      console.log('[ParticipationContext] Participation creee:', res.data);
      return res.data;
    } catch (err) {
      console.error('[ParticipationContext] Erreur lors de la creation de participation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour recuperer les participations d'un utilisateur
  const getUserParticipations = async (userId) => {
    try {
      setLoading(true);
      const res = await API.get(`/participations/user/${userId}`);
      setParticipations(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error('[ParticipationContext] Erreur lors de la recuperation des participations utilisateur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour recuperer les participations a un challenge
  const getChallengeParticipations = async (challengeId) => {
    try {
      setLoading(true);
      const res = await API.get(`/participations/challenge/${challengeId}`);
      return res.data.data;
    } catch (err) {
      console.error('[ParticipationContext] Erreur lors de la recuperation des participations au challenge:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une participation
  const deleteParticipation = async (participationId) => {
    try {
      setLoading(true);
      await API.delete(`/participations/${participationId}`);
      // Retirer de la liste locale
      setParticipations((prev) => prev.filter((p) => p.id !== participationId));
      console.log('[ParticipationContext] Participation supprimee');
    } catch (err) {
      console.error('[ParticipationContext] Erreur lors de la suppression de participation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParticipationContext.Provider
      value={{
        participations,
        loading,
        createParticipation,
        getUserParticipations,
        getChallengeParticipations,
        deleteParticipation,
      }}
    >
      {children}
    </ParticipationContext.Provider>
  );
};

export const useParticipation = () => useContext(ParticipationContext);
