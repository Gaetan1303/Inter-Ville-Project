import React, { createContext, useContext, useState } from 'react';
import API from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // fonction qui permet de connecter un utilisateur
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      console.log('Login response:', res.data);

      // Vérifier que la connexion a réussi
      if (!res.data.success) {
        throw new Error(res.data.message || 'Connexion échouée');
      }

      // Stocker le token dans le state et dans le localStorage
      const accessToken = res.data.data.accessToken;
      setToken(accessToken);
      try {
        localStorage.setItem('accessToken', accessToken);
      } catch (_) {}

      // Injecter le token dans axios pour toutes les futures requêtes
      API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Récupérer les informations de l'utilisateur connecté
      const userRes = await API.get('/auth/me');
      setUser(userRes.data.data.user);

      return res.data;
    } catch (err) {
      // Propager l'erreur pour que le composant Login puisse l'afficher
      throw new Error(err.response?.data?.message || 'Connexion échouée');
    }
  };

  // fonction qui permet d'enregistrer un nouvel utilisateur
  const register = async (payload) => {
    if (!payload.email.endsWith('@laplateforme.io'))
      throw new Error('Email doit être @laplateforme.io');
    try {
      const res = await API.post('/auth/register', payload);
      return res.data;
    } catch (err) {
      return {
        message: 'Inscription echoué.',
      };
    }
  };

  // fonction qui permet de déconnecter un utilisateur
  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('accessToken');
    } catch (_) {}
    delete API.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
