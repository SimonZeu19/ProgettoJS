import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

function Payment({ totalPrice, onPaymentSuccess, onPaymentError }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState(null);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const userId = localStorage.getItem('userId');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'cardNumber' || name === 'expirationDate' || name === 'cvv') {
      setCardData({ ...cardData, [name]: value });
    } else if (name === 'deliveryAddress') {
      setDeliveryAddress(value);
    }
  };

  const validateCardData = () => {
    if (!cardData.cardNumber || !cardData.expirationDate || !cardData.cvv || !deliveryAddress) {
      setError('Tutti i campi sono obbligatori');
      return false;
    }

    // Validazione del numero della carta, della data di scadenza e del CVV
    // ...

    return true;
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!validateCardData()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/cart/processPayment', {
        userId: userId,
        cardNumber: cardData.cardNumber,
        expirationDate: cardData.expirationDate,
        cvv: cardData.cvv,
        deliveryAddress: deliveryAddress,
        totalPrice: totalPrice,
      });
      console.log('Payment successful:', response.data);
      setPaymentSuccessMessage('Pagamento completato con successo.');
      onPaymentSuccess();
      setTimeout(() => {
        setPaymentSuccessMessage(null);
        window.location.reload(); // Aggiorna la pagina dopo un certo periodo di tempo
      }, 3000); // Tempo in millisecondi (3 secondi)
    } catch (error) {
      setError(error.response.data.message);
      onPaymentError(error);
      console.error('Errore durante il pagamento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {paymentSuccessMessage && (
        <div style={{ background: 'green', color: 'white', padding: '10px', textAlign: 'center' }}>
          {paymentSuccessMessage}
        </div>
      )}
      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column' }}>
        
       <h2>Indirizzo di Consegna</h2>
        <label>
          Indirizzo di Consegna:
          <input type="text" name="deliveryAddress" value={deliveryAddress} onChange={handleInputChange} placeholder="Paese, Città, Via, Numero, Nome sul campanello" />
        </label>
       
        <h2>Metodo di Pagamento</h2>
        <label>
          Numero Carta:
          <input type="text" name="cardNumber" value={cardData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" />
        </label>
        <label>
          Data di Scadenza:
          <input type="text" name="expirationDate" value={cardData.expirationDate} onChange={handleInputChange} placeholder="MM/YY" />
        </label>
        <label>
          CVV:
          <input type="text" name="cvv" value={cardData.cvv} onChange={handleInputChange} placeholder="123" />
        </label>
        <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Contenitore flessibile per centrare il pulsante */}
        <Button
          variant="contained"
          style={{ backgroundColor: '#ffd600', color: 'black', maxWidth: '200px' }} // Imposta lo stile del pulsante
          type="submit"
          disabled={loading}
          size="large" // Imposta la dimensione del pulsante
        >
          {loading ? 'Processo di pagamento...' : 'Acquista ora'}
        </Button>
      </div>
      </form>
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default Payment;



