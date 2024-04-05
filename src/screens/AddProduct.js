import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

function AddProduct() {
   
  const [productData, setProductData] = useState({
    name: '',
    image: '',
    description: '',
    price: 1,
    brand: '',
    countInStock: 1,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validazione per assicurarsi che il valore sia maggiore o uguale a zero
    if (name === 'price' || name === 'countInStock') {
      if (parseInt(value) < 0) {
        return; // Ignora i valori negativi
      }
    }
  
    setProductData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verifica se tutti i campi obbligatori sono stati compilati
      if (!productData.name || !productData.image || !productData.description || !productData.price || !productData.brand || !productData.countInStock) {
        setErrorMessage('Tutti i campi sono obbligatori.');
        return;
      }

      // Controlla se esiste già un prodotto con lo stesso nome
      const response = await axios.post('http://localhost:5000/api/products/addProduct', productData);
      console.log('New product added:', response.data);
      setErrorMessage(''); // Resetta eventuali errori precedenti
      navigate('/getproducts');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
    } else {
        console.error("Error updating product:", error);
        setErrorMessage("Error updating product. Please try again.");
    }
      {/**if (error.response && error.response.status === 400 && error.response.data.message === 'Un prodotto esiste già nel database con lo stesso nome o la stessa immagine') {
        setErrorMessage('Un prodotto esiste già nel database con lo stesso nome o la stessa immagine.'); // Imposta il messaggio di errore appropriato
      } else if(error.response && error.response.status === 400 && error.response.data.message === 'La quantità in stock non può contenere numeri decimali') {
        //console.error('Error adding product:', error);
        setErrorMessage('La quantità in stock non può contenere numeri decimali'); // Imposta un messaggio di errore generico
      }
      else {
        console.error('Error adding product:', error);
        setErrorMessage('Errore durante l\'aggiunta del prodotto. Riprova.'); // Imposta un messaggio di errore generico
      } */}
    }
  };

  return (
    <div>
      <AdminNavbar/>
      
      <h2 style={{display: 'flex', justifyContent: 'center' }}>Aggiungi nuovo prodotto</h2>
      {errorMessage && <div className="error-message" style={{display: 'flex', justifyContent: 'center', color: 'red' }}>{errorMessage}</div>}
      {/**{errorMessage && <p>{errorMessage}</p>} */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input type="text" name="name" value={productData.name} onChange={handleChange} />
        </div>
        <div>
          <label>URL dell'immagine:</label>
          <input type="text" name="image" value={productData.image} onChange={handleChange} />
        </div>
        <div>
          <label>Descrizione:</label>
          <textarea name="description" value={productData.description} onChange={handleChange}></textarea>
        </div>
        <div>
          <label>Prezzo:</label>
          <input type="number" name="price" value={productData.price} onChange={handleChange} />
        </div>
        <div>
          <label>Brand:</label>
          <input type="text" name="brand" value={productData.brand} onChange={handleChange} />
        </div>
        <div>
          <label>Quantità Disponibile:</label>
          <input type="number" name="countInStock" value={productData.countInStock} onChange={handleChange} />
        </div>
        <button type="submit">Aggiungi Prodotto</button>
      </form>
      </div>
      <AdminFooter/>
    </div>
  );
}

export default AddProduct;