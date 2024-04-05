import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logout from './Logout.js'; // Importa la funzione di logout

function NavbarUser({ cartItems }) {
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
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f0f0f0' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <h1 style={{ margin: '20px auto 20px 0' }}>ZeuShop-Ecommerce</h1>
      </div>
      <div style={{ position: 'relative' }}>
        <Link to={`/users/${userId}`}>Home</Link>
         <Link to={`/updateProfile/${userId}`}style={{ marginLeft: '10px' }}>Profile</Link>

      
        <Link to={`/getCartItems/${userId}`} style={{ marginLeft: '10px', position: 'relative' }}>
          {cartItems && cartItems.length > 0 && (
            <span className="notification-badge" style={{ position: 'absolute', top: '-15px', right: '-15px', backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '4px 6px', fontSize: '9px' }}>
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
          </svg>
        </Link>
        <Link to={`/orders/${userId}`} style={{ marginLeft: '10px' }} >Ordini</Link>
        <Link to="/" style={{ marginLeft: '10px' }} onClick={handleLogout}>Esci</Link>
      </div>
    </nav>
  );
}

export default NavbarUser;







