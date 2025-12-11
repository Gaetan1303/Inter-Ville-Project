import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChallengeProvider } from "./contexts/ChallengeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Header from "./components/header";
import Profile from "./pages/Profile";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import CreateChallenge from "./pages/CreateChallenge";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChallengeProvider>
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Challenges" element={<Challenges />} />
            <Route path="/Challenge/:id" element={<ChallengeDetail />} />
            <Route path="/create" element={<CreateChallenge />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        </ChallengeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
