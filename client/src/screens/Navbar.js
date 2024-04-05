import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const handleLogout = () => {
    // Esegui il logout rimuovendo le informazioni di autenticazione dal localStorage
    localStorage.removeItem('isLoggedIn');
    // Reindirizza l'utente alla pagina di login
    window.location.href = "/";
  };

  return (
    <div className="navbar-nav">
      <NavLink className="nav-link" to="/getusers">Users</NavLink>
      <span className="separator">|</span>
      <NavLink className="nav-link" to="/getproducts">Products</NavLink>
      <span className="separator">|</span>
      <NavLink className="nav-link" to="/" onClick={handleLogout}>Log-out</NavLink>
    </div>
  );
}

export default Navbar;