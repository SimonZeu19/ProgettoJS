import React, { useState } from 'react';
import axios from 'axios';

function RemoveFromCart({ userId, productId, onRemove }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveFromCart = async () => {
    setLoading(true);
    try {
      console.log(productId); // Verifica se productId è passato correttamente e ha un valore definito
      // Esegui la richiesta per rimuovere il prodotto dal carrello
      const response = await axios.delete(`http://localhost:5000/api/cart/removeFromCart/${userId}/${productId}`);
      console.log('Product removed from cart:', response.data);
      // Se il prodotto viene rimosso con successo dal carrello, puoi gestire qui il feedback all'utente
      onRemove(); // Chiamata alla funzione di gestione della rimozione
    } catch (error) {
      setError(error.response.data.message);
      console.error('Error removing product from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleRemoveFromCart} disabled={loading}>
        {loading ? 'Removing from Cart...' : 'Elimina dal Carrello'}
      </button>
      
      {error && <p>{error}</p>}
    </div>
  );
}

export default RemoveFromCart;