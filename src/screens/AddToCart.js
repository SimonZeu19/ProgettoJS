import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddToCart({ productId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Recupera l'ID dell'utente dal localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Gestisci il caso in cui l'ID dell'utente non è presente nel localStorage
      console.log('User ID not found in localStorage');
    }
  }, []);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Esegui la richiesta per aggiungere il prodotto al carrello
      const response = await axios.post(`http://localhost:5000/api/cart/addToCart/${userId}`, {
        productId: productId,
        quantity: 1, // Puoi impostare la quantità in base alle esigenze
      });
      console.log('Product added to cart:', response.data);
      // Se il prodotto viene aggiunto con successo al carrello, puoi gestire qui il feedback all'utente
    } catch (error) {
      setError(error.response.data.message);
      console.error('Error adding product to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleAddToCart} disabled={loading}>
        {loading ? 'Adding to Cart...' : 'Add to Cart'}
      </button>
      {/**{error && <p>{error}</p>} */}
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default AddToCart;