import React, { useState } from "react";
import { Link } from "react-router-dom";

const header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <nav className={`nav ${menuOpen ? "nav-open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Accueil
          </Link>
          <Link to="/challenges" onClick={closeMenu}>
            Défis
          </Link>
          <Link to="/Créer" onClick={closeMenu}>
            Créer
          </Link>
          <Link to="/profile" onClick={closeMenu}>
            Profil
          </Link>
          {isLoggedIn ? (
            <Link to="/logout" onClick={closeMenu}>
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
