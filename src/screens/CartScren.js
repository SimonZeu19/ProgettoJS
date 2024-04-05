import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RemoveFromCart from './RemovefromCart';
import UpdateQuantityProduct from './UpdateQuantityProduct';
import Payment from './Payment';
import NavbarUser from './NavbarUser';
import FooterUser from './FooterUser';

function CartScreen() {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Recupera l'ID dell'utente dal localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.log('User ID not found in localStorage');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    // Funzione per recuperare gli elementi del carrello
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/getCartItems/${userId}`);
            setCartItems(response.data);
        } catch (error) {
            console.error('Errore durante il recupero dei dati del carrello:', error);
        }
    };

    // Funzione per gestire l'aggiornamento dei dati del carrello dopo aver modificato la quantità di un prodotto
    const handleQuantityUpdated = () => {
        fetchCartItems(); // Aggiorna i dati del carrello
    };

    // Funzione per gestire il successo del pagamento
    const handlePaymentSuccess = () => {
        // Logica per gestire il successo del pagamento
        console.log('Payment successful');
        // Aggiorna lo stato del carrello o reindirizza l'utente, ad esempio
    };

    // Funzione per gestire l'errore del pagamento
    const handlePaymentError = (error) => {
        // Logica per gestire l'errore del pagamento
        console.error('Payment error:', error);
        // Mostra un messaggio di errore all'utente, ad esempio
    };

    return (
        <div>
          <NavbarUser />
          <div style={{ paddingTop: '70px', paddingBottom: '70px' }}>
            <div style={{ padding: '0' }}>
              <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Il tuo carrello</h1>
              {cartItems.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Il carrello è vuoto.</p>
              ) : (
                <ul>
                  {cartItems.map((item) => (
                    <li key={item.product}>
                      <h3>{item.name}</h3>
                      <img src={item.image} alt={item.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                      <p>Quantità: {item.quantity}</p>
                      <UpdateQuantityProduct userId={userId} productId={item.product} onQuantityUpdated={handleQuantityUpdated} />
                      <p>Prezzo unitario: €{item.price}</p>
                      <p style={{ color:'green' }}>Quantità Disponibile: {item.countInStock}</p>
                      <p style={{ color:'red' }}>Prezzo totale: €{item.price * item.quantity}</p>
                      <RemoveFromCart
                        userId={userId}
                        productId={item.product}
                        onRemove={() => setCartItems(prevCartItems => prevCartItems.filter(cartItem => cartItem.product !== item.product))}
                      />
                    </li>
                  ))}
                  <div style={{ textAlign: 'center', marginTop: '20px',color:'red' }}>
                    <h2>Totale ordine: €{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) }</h2>
                  </div>
                  <Payment
                    totalPrice={cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </ul>
              )}
            </div>
          </div>
          <FooterUser />
        </div>
      );
}

export default CartScreen;


{/** questo funziona ma non ha il pagamneto
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RemoveFromCart from './RemovefromCart';
import UpdateQuantityProduct from './UpdateQuantityProduct';
import Payment from './Payment';

function CartScreen() {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    // Funzione per recuperare gli elementi del carrello
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/cart/getCartItems/${userId}`);
            setCartItems(response.data);
        } catch (error) {
            console.error('Errore durante il recupero dei dati del carrello:', error);
        }
    };

    useEffect(() => {
        // Recupera l'ID dell'utente dal localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.log('User ID not found in localStorage');
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchCartItems();
        }
    }, [userId]);

    // Funzione per gestire l'aggiornamento dei dati del carrello dopo aver modificato la quantità di un prodotto
    const handleQuantityUpdated = () => {
        fetchCartItems(); // Aggiorna i dati del carrello
    };
 
    return (
        <div>
            <div style={{ padding: '20px' }}>
                <h1 style={{ textAlign: 'center' }}>Il tuo carrello</h1>
                {cartItems.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>Il carrello è vuoto.</p>
                ) : (
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.product}>
                                <h3>{item.name}</h3>
                                <img src={item.image} alt={item.name} style={{ maxWidth: '100px', maxHeight: '100px' }}/>
                                <p>Quantità: {item.quantity}</p>
                                {/* Renderizza il componente UpdateQuantityProduct e passa la funzione handleQuantityUpdated come prop 
                                <UpdateQuantityProduct userId={userId} productId={item.product} onQuantityUpdated={handleQuantityUpdated} />
                                <p>Prezzo unitario: €{item.price}</p>
                                <p>Prezzo totale: €{item.price * item.quantity}</p>
                                <RemoveFromCart
                                    userId={userId}
                                    productId={item.product}
                                    onRemove={() => setCartItems(prevCartItems => prevCartItems.filter(cartItem => cartItem.product !== item.product))}
                                />
                            </li>
                        ))}
                         <div style={{ textAlign: 'center', marginTop: '20px' }}>
                             <p>Prezzo totale: €{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</p>
                         </div>
                    </ul>
                    
                )}
            </div>
            
        </div>
    );
}

export default CartScreen;


*/}





















