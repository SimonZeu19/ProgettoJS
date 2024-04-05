import React, { useState } from 'react';
import Axios from 'axios';

function DeleteOrder({ orderId }) {
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      await Axios.delete(`http://localhost:5000/api/cart/orders/${orderId}`);
      // Ricarica la pagina corrente dopo l'eliminazione dell'ordine
      window.location.reload();
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'ordine:", error);
      setError("Errore durante l'eliminazione dell'ordine. Si prega di riprovare.");
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {error && <div className="error-message">{error}</div>}
      <button onClick={() => setShowConfirmation(true)} style={{ position: 'absolute', top: '-260px', right: 0 }}>
        Elimina
      </button>
      {/* Visualizza il popup di conferma solo se showConfirmation è true */}
      {showConfirmation && (
        <div className="confirmation-modal">
          <p>Sei sicuro di voler eliminare questo ordine?</p>
          <button onClick={handleDelete}>Sì</button>
          <button onClick={() => setShowConfirmation(false)}>No</button>
        </div>
      )}
    </div>
  );
}

export default DeleteOrder;