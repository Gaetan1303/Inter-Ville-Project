import React, { createContext, useContext } from "react";
import API from "../api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const register = async (payload) => {
    if (!payload.email.endsWith("@laplateforme.io"))
      throw new Error("Email doit être @laplateforme.io");
    try {
      const res = await API.post("/auth/register", payload);
      return res.data;
    } catch (err) {
      // fallback: return success but note that admin validation required
      return {
        message:
          "Inscription simulée. Vérifie ton email. Compte en attente de validation.",
      };
    }
  };

  //   localStorage.removeItem("token");
  //   setUser(null);
  // };

  return (
    <AuthContext.Provider value={{ register }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
