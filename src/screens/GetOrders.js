import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarUser from './NavbarUser';
import FooterUser from './FooterUser';
import DeleteOrder from './DeleteOrder';
import './Order.css';

// Funzione per formattare la data da formato ISO8601 a un formato leggibile
function formatDate(isoDate) {
  const date = new Date(isoDate); // Converti la stringa ISO8601 in un oggetto Date
  const options = {
    weekday: 'long', // Nome del giorno della settimana (es. lunedì)
    year: 'numeric', // Anno
    month: 'long', // Nome del mese (es. marzo)
    day: 'numeric', // Giorno del mese
  };
  return date.toLocaleDateString('it-IT', options); // Formatta la data nel formato desiderato
}

const OrdersDetails = () => {
  const [orders, setOrders] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/orders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Errore nel recupero degli ordini:', error);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, []);

  const handleDeleteOrder = (deletedOrderId) => {
    setOrders(orders.filter(order => order._id !== deletedOrderId));
    setSuccessMessage('Ordine eliminato con successo.');
    setTimeout(() => {
      setSuccessMessage('');
    }, 1000); // Nasconde il messaggio di successo dopo 3 secondi
  };

  return (
    <div className="orders-container">
      <NavbarUser />
      <div className="orders-content">
        <h1>I tuoi ordini</h1>
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
          </div>
        )}
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <h2>ID ordine: {order._id}</h2>
            <p className="order-info">Stato: {order.status}</p>
            <p className="order-info">Data Ordine Effettuato: {formatDate(order.createdAt)}</p>
            <h2 className="order-info">Data di consegna: {formatDate(order.deliveryDate)}</h2>
            <p className="order-info">Indirizzo di consegna: {order.deliveryAddress}</p>
            <h2 className="price-info" style={{ color: 'red' }}>Totale: €{order.totalPrice}</h2>
            <DeleteOrder orderId={order._id} onDelete={handleDeleteOrder} />
            <ul>
              {order.items.map(item => (
                <li key={item.product} className="order-item">
                  <h3>{item.name}</h3>
                  <img src={item.image} alt={item.name} />
                  <p>Quantità: {item.quantity}</p>
                  <p>Prezzo unitario: €{item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <FooterUser />
    </div>
  );
};

export default OrdersDetails;


