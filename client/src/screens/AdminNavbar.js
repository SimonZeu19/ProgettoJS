import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logout from './Logout.js'; // Importa la funzione di logout

function AdminNavbar() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Hook per la navigazione

  useEffect(() => {
    // Recupera l'ID dell'utente dal localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Se l'utente non è autenticato, reindirizzalo alla pagina di accesso
      navigate('/'); // Modifica il percorso di reindirizzamento in base alla tua struttura di navigazione
    }
  }, [navigate]);

  const handleLogout = () => {
    // Rimuovi l'ID dell'utente dal localStorage
    localStorage.removeItem('userId');
    // Chiamare la funzione di logout
    logout();
    // Reindirizza l'utente alla pagina di login o alla home dopo il logout
    navigate('/'); // Modifica il percorso di reindirizzamento in base alla tua struttura di navigazione
  };

  return (
    <nav className="navbar">
      <h1>Admin Dashboard</h1> {/* Titolo della navbar */}
      
      <ul className="navbar-links">
      <li className="nav-item">
      <Link to="/dashboard" style={{ marginLeft: '10px' }} >Home</Link>
      </li>
        <li className="nav-item">
          <Link className="nav-link" to="/getusers">Utenti</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/getproducts">Prodotti</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/" onClick={handleLogout}>Esci</Link>
        </li>
        {/* Aggiungi altri link per altre pagine dell'area amministrativa */}
      </ul>
    </nav>
  );
}

export default AdminNavbar;



{/** import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logout from './Logout.js'; // Importa la funzione di logout





function AdminNavbar() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Hook per la navigazione

  useEffect(() => {
    // Recupera l'ID dell'utente dal localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      console.log('User ID retrieved from localStorage:', storedUserId);
      setUserId(storedUserId);
    } else {
      // Se l'ID utente non è presente nel localStorage, reindirizza l'utente alla pagina di login
      navigate('/login'); // Sostituisci '/login' con il percorso della tua pagina di login
    }
  }, []);

  const handleLogout = () => {
    // Rimuove l'ID utente dal localStorage
    localStorage.removeItem('userId');
    // Reindirizza l'utente alla pagina di login
    navigate('/'); // Sostituisci '/login' con il percorso della tua pagina di login
  };

  return (
    <nav className="navbar">
      <h1>Admin Dashboard</h1> {/* Titolo della navbar 
      <ul className="navbar-links">
        {userId && ( // Controlla se l'ID utente è presente
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/getusers">Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/getproducts">Products</Link>
            </li>
            <li className="nav-item">
              <Link to="/" style={{ marginLeft: '10px' }} onClick={handleLogout}>Logout</Link>
            </li>
            {/* Aggiungi altri link per altre pagine dell'area amministrativa 
          </>
        )}
      </ul>
    </nav>
  );
}

export default AdminNavbar;*/}