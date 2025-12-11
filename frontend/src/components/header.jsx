import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  return (
    <div>
      <header className="topbar">
        <div className="brand">Inter-Ville</div>
        <button
          className="menu-toggle"
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link to="/" onClick={closeMenu}>
            Accueil
          </Link>
          <Link to="/challenges" onClick={closeMenu}>
            Défis
          </Link>
          {user && (
            <>
              <Link to="/create" onClick={closeMenu}>
                Créer
              </Link>
              <Link to="/profile" onClick={closeMenu}>
                Profil
              </Link>
            </>
          )}

          {user ? (
            <Link
              to="/"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Se déconnecter
            </Link>
          ) : (
            <>
              <Link to="/Register" onClick={closeMenu}>
                S'inscrire
              </Link>
              <Link to="/login" onClick={closeMenu}>
                Se connecter
              </Link>
            </>
          )}
        </nav>
      </header>
    </div>
  );
};

export default header;
