import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'; // Importa il componente AdminNavbar
import AdminFooter from './AdminFooter'; // Importa il componente Footer
import './AdminDashboard.css';
import './AdminFooter.css'

function AdminDashboard() {
  const location = useLocation();
  const welcomeMessage = new URLSearchParams(location.search).get('welcome');
  const handleLogout = () => {
    // Rimuovi il token di sessione dal localStorage
    localStorage.removeItem('userInfo');
    // Reindirizza l'utente alla pagina di accesso
    window.location.href = "/signin";
  };

  

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      {welcomeMessage && <div className="welcome-message">{welcomeMessage}</div>}
      <div className="dashboard-summary">
        <h2>Dashboard Summary</h2>
        <p>Welcome to the Admin Dashboard!</p>
        <p>
          In questa dashboard, puoi gestire varie funzionalità dell'applicazione amministrativa. Ecco cosa puoi fare:
        </p>
        <ul>
          <li>Visualizzare e gestire gli utenti registrati.</li>
          <li>Aggiungere, modificare ed eliminare prodotti dal catalogo.</li>
        
          {/* Aggiungi altre funzionalità disponibili */}
        </ul>
        {/* Aggiungi altre sezioni di riepilogo o grafici qui */}
      </div>
      <AdminFooter />
    </div>
  );
}

export default AdminDashboard;


