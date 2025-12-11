import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axiosInstance";

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await API.get("/challenges");      
      setChallenges(res.data.data);
    } catch (err) {
      console.error("erreur lors de récupération des défis.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

 
  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        loading,
        fetchChallenges,        
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => useContext(ChallengeContext);
