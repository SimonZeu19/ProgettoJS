import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdmindFooter from './AdminFooter';

function ProductDetails() {
  const { id } = useParams(); // Ottiene l'ID del prodotto dalla URL
  const [product, setProduct] = useState(null); // Stato per memorizzare i dettagli del prodotto
  const [errorMessage, setErrorMessage] = useState(''); // Stato per gestire i messaggi di errore

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/getProduct/${id}`);
        setProduct(response.data); // Imposta i dettagli del prodotto nello stato
        setErrorMessage(''); // Resetta eventuali messaggi di errore precedenti
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setErrorMessage('Product not found'); // Imposta il messaggio di errore appropriato se il prodotto non è trovato
        } else {
          setErrorMessage('Error fetching product details'); // Imposta un messaggio di errore generico per altri tipi di errori
        }
      }
    };

    fetchProduct(); // Chiama la funzione per recuperare i dettagli del prodotto quando il componente viene montato
  }, [id]); // L'effetto dipende dall'ID del prodotto, quindi verrà eseguito ogni volta che l'ID cambia

  return (
    <div>
      <AdminNavbar/>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {errorMessage && <p>{errorMessage}</p>}
      {product && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <h2>{product.name}</h2>
              <p>ID: {product._id}</p>
              <p>Prezzo: {product.price}</p>
              <p>Brand: {product.brand}</p>
              <p>Descrizione: {product.description}</p>
              <p>Quantittà Disponibile: {product.countInStock}</p>
              {/* Altri dettagli del prodotto possono essere mostrati qui */}
            </div>
            <div>
              <img src={product.image} alt={product.name} style={{ width: '300px', height: '400px', marginLeft: '200px' }} />
            </div>
          </div>
        </div>
      )}
    </div>
    <AdmindFooter/>
    </div>
  );
}

export default ProductDetails;