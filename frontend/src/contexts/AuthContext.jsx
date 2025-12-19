import React, { createContext, useContext, useState } from 'react';
import API from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Fonction pour rafraîchir l'accessToken avec le refreshToken
  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        logout();
        return null;
      }

      const res = await API.post('/auth/refresh', { refreshToken: storedRefreshToken });
      if (res.data.success) {
        const newAccessToken = res.data.data.accessToken;
        const newRefreshToken = res.data.data.refreshToken;

        setToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return newAccessToken;
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement du token:', err);
      logout();
      return null;
    }
  };

  // Récupérer les tokens depuis localStorage au montage de l'app
  React.useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && storedRefreshToken) {
      setToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;

      // Récupérer les infos utilisateur
      API.get('/auth/me')
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data.user);
          }
        })
        .catch(() => {
          // Si la requête échoue, essayer de rafraîchir le token
          refreshAccessToken().then((newToken) => {
            if (newToken) {
              API.get('/auth/me')
                .then((res) => {
                  if (res.data.success) {
                    setUser(res.data.data.user);
                  }
                })
                .catch(() => logout());
            }
          });
        });
    }
  }, []);

  // fonction qui permet de connecter un utilisateur
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      // Log supprimé pour la production

      // Vérifier que la connexion a réussi
      if (!res.data.success) {
        throw new Error(res.data.message || 'Connexion échouée');
      }

      // Stocker les tokens dans le state et dans le localStorage
      const accessToken = res.data.data.accessToken;
      const refreshToken = res.data.data.refreshToken;
      setToken(accessToken);
      setRefreshToken(refreshToken);
      try {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
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
    setRefreshToken(null);
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (_) {}
    delete API.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, refreshToken, login, register, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
