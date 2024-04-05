import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';


function UserOrders() {
  const { userId } = useParams(); // Ottiene l'ID dell'utente dalla URL
  const [orders, setOrders] = useState([]); // Stato per memorizzare gli ordini dell'utente
  const [errorMessage, setErrorMessage] = useState(''); // Stato per gestire i messaggi di errore

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Ottiene gli ordini dell'utente dal server
        const response = await axios.get(`http://localhost:5000/api/users/admin/orders/${userId}`);
         // Aggiunge i dettagli del prodotto a ciascun ordine
        const ordersWithProductDetails = await Promise.all(response.data.map(async order => {
           // Ottiene i dettagli del prodotto per ciascun elemento nell'array items dell'ordine
          const itemsWithProductDetails = await Promise.all(order.items.map(async item => {
            try {
               // Ottiene i dettagli del prodotto dal server
              const productDetailsResponse = await axios.get(`http://localhost:5000/api/products/getProduct/${item.product}`);
                // Aggiunge i dettagli del prodotto all'oggetto item
              return {
                ...item,
                product: productDetailsResponse.data // Aggiunge i dettagli del prodotto all'oggetto item
              };
            } catch (error) {
              console.error('Error fetching product details:', error);
              return item; // Restituisci l'oggetto item senza i dettagli del prodotto in caso di errore
            }
          }));
          return {
            ...order,
            items: itemsWithProductDetails // Aggiunge i dettagli del prodotto aggiornati all'ordine
          };
        }));
        setOrders(ordersWithProductDetails);
        setErrorMessage(''); // Resetta eventuali messaggi di errore precedenti
      } catch (error) {
        setErrorMessage('Error fetching user orders'); // Imposta un messaggio di errore generico per altri tipi di errori
      }
    };

    fetchOrders(); // Chiama la funzione per recuperare gli ordini dell'utente quando il componente viene montato
  }, [userId]); // L'effetto dipende dall'ID dell'utente, quindi verrà eseguito ogni volta che l'ID cambia

  return (
    <div  style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} >{/** Per evitare che il footer nasconde il contenuto della pagina */}
      <AdminNavbar/>
   
    <div style={{ margin: '20px' }}> {/* Aggiungi del margine al contenitore principale */}
    
      <h1>Ordini dell'Utente {userId}</h1>
      {errorMessage && <p>{errorMessage}</p>}
      {orders.length === 0 && <p>Non ci sono ordini per questo utente.</p>}
      {orders.length > 0 && (
        <ul>
          {orders.map(order => (
            <li key={order._id} style={{ marginBottom: '100px', border: '10px solid #ccc', padding: '10px' }}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Created At:</strong> {order.createdAt}</p>
              <p><strong>Prezzo Totale:</strong> €{order.totalPrice}</p>
              <p><strong>Prodotti:</strong></p>
              <ul>
                {order.items.map(item => (
                  <li key={item.name} style={{ marginBottom: '10px', borderBottom: '1px dashed #ccc', paddingBottom: '10px' }}>
                    <p><strong>Nome Prodotto:</strong> {item.name}</p>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ maxWidth: '100px', maxHeight: '100px' }} // Imposta le dimensioni massime
                    />
                    <p><strong>Quantità:</strong> {item.quantity}</p>
                    <p><strong>Descrizione Prodotto:</strong> {item.description}</p>
                    <p><strong>Brand Prodotto:</strong> {item.brand}</p>
                    {/* Aggiungi altri dettagli del prodotto se necessario */}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
    <AdminFooter/>
    </div>
  );
}

export default UserOrders;




