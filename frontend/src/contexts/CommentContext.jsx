import React, { createContext, useContext } from 'react';
import API from '../api/axiosInstance';

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
  
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
    <CommentContext.Provider
      value={{       
        fetchComments,
        postComment,     
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => useContext(CommentContext);