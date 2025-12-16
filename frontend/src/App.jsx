import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ChallengeProvider } from './contexts/ChallengeContext';
import { AdminProvider } from './contexts/AdminContext';
import { CommentProvider } from './contexts/CommentContext';
import { ParticipationProvider } from './contexts/ParticipationContext';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Header from './components/header';
import Profile from './pages/Profile';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import CreateChallenge from './pages/CreateChallenge';
import EditChallenge from './pages/EditChallenge';
import Admin from './pages/Admin';
import ChatWidget from './components/ChatWidget';

const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
        <ChallengeProvider>
          <AdminProvider>
            <CommentProvider>
              <ParticipationProvider>
                <Header />
            <main className="main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Challenges" element={<Challenges />} />
                <Route path="/Challenge/:id" element={<ChallengeDetail />} />
                <Route path="/challenges/:id/edit" element={<EditChallenge />} />
                <Route path="/create" element={<CreateChallenge />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <Admin />
                    </ProtectedAdminRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
                <ChatWidget />
              </ParticipationProvider>
            </CommentProvider>              
          </AdminProvider>
        </ChallengeProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
