const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');




// Route per recuperare gli elementi del carrello per un determinato utente
router.get('/getCartItems/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Trova il carrello dell'utente nel database
      const cart = await Cart.findOne({ user: userId });
      
      // Se il carrello esiste ma è vuoto, restituisci un messaggio
      if (!cart || (cart && cart.items.length === 0)) {
        return res.status(404).json({ message: 'Il carrello è vuoto.' });
      }
  
      // Se il carrello esiste, restituisci gli elementi del carrello
      res.status(200).json(cart.items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

   router.post('/addToCart/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { productId } = req.body; 
        const defaultQuantity = 1; // Imposta la quantità predefinita a 1

        // Controlla se productId è fornito
        if (!productId) {
            return res.status(400).json({ message: 'productId è obbligatorio.' });
        }

        // Trova il prodotto nel database
        const product = await Product.findById(productId);

        // Controlla se il prodotto esiste
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato.' });
        }

        // Trova il carrello dell'utente nel database
        let cart = await Cart.findOne({ user: userId });

        // Se il carrello non esiste, crea un nuovo carrello
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Controlla se il prodotto è già nel carrello
        const existingProductIndex = cart.items.findIndex(item => item.product.toString() === productId.toString());

        if (existingProductIndex !== -1) {
            // Se il prodotto è già presente nel carrello, aggiorna la quantità
            cart.items[existingProductIndex].quantity += defaultQuantity; // Aggiorna con la quantità predefinita
        } else {
            // Se il prodotto non è presente nel carrello, aggiungi una nuova voce con la quantità predefinita
            cart.items.push({ 
                product: productId, 
                quantity: defaultQuantity, 
                price: product.price, 
                name: product.name, 
                description: product.description, 
                image: product.image, 
                brand: product.brand,
                countInStock:product.countInStock
            });
        }

        // Calcola il prezzo totale del carrello
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Salva il carrello aggiornato nel database
        await cart.save();

        res.status(200).json({ cart, message: 'Prodotto aggiunto con successo al carrello dell\'utente.' }); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




// Funzione per calcolare la data precisa della consegna
function calculateDeliveryDate() {
    let deliveryDate = new Date(Date.now() + 72 * 60 * 60 * 1000);

    // Verifica se la data di consegna prevista cade su un giorno festivo o non lavorativo
    while (isHoliday(deliveryDate) || !isWorkingDay(deliveryDate)) {
        // Se la data di consegna cade su un giorno festivo o non lavorativo, sposta la data di consegna in avanti di un giorno
        deliveryDate.setDate(deliveryDate.getDate() + 1);
    }

    return deliveryDate;
}

// Funzione per verificare se una data è un giorno lavorativo (escludendo sabato e domenica)
function isWorkingDay(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6; // Restituisce true se non è sabato (6) o domenica (0)
}
// Array contenente le date delle festività
const holidayDates = ['2024-01-01', '2024-04-25', '2024-05-01', '2024-06-02'];

// Funzione per verificare se una data è una festività
function isHoliday(date) {
    // Formatta la data nel formato 'YYYY-MM-DD' per confrontare con le date delle festività
    const formattedDate = date.toISOString().split('T')[0]; // Ottiene la parte 'YYYY-MM-DD'

    // Verifica se la data formattata è presente nell'array delle date festività
    return holidayDates.includes(formattedDate);
}

// Funzione per verificare se il CVV è nel formato corretto
function isValidCVV(cvv) {
    const regex = /^\d{3,4}$/; // CVV deve essere composto da 3 o 4 cifre
    return regex.test(cvv);
}

// Funzione per verificare se il numero della carta di credito è nel formato corretto
function isValidCardNumber(cardNumber) {
    const regex = /^\d{16}$/;
    
    return regex.test(cardNumber);
}

// Funzione per verificare se la data di scadenza è nel formato corretto
function isValidExpirationDate(expirationDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Formato MM/YY
    if (!regex.test(expirationDate)) {
        return false;
    }
    const [month, year] = expirationDate.split('/');
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const currentMonth = new Date().getMonth() + 1;
    return parseInt(year) > parseInt(currentYear) || (parseInt(year) === parseInt(currentYear) && parseInt(month) >= currentMonth);
}


// Funzione per verificare se l'indirizzo di consegna è nel formato corretto
function isValidAddress(address) {
    // Formato dell'indirizzo: [Paese], [Città], [Via], [Numero], [Nome sul campanello]
    const addressRegex = /^[^,]+,[^,]+,[^,]+,[^,]+,.+$/; // Regex più generale
    
    const parts = address.split(',').map(part => part.trim());
    
    // Controlla se ci sono 5 parti (paese, città, via, numero, nome sul campanello) e se ciascuna parte rispetta il formato
    return parts.length === 5 && addressRegex.test(address);
}

router.post('/processPayment', async (req, res) => {
    try {
        const { userId, cardNumber, expirationDate, cvv, deliveryAddress } = req.body;

        // Verifica se tutti i campi obbligatori sono forniti
        if (!userId || !cardNumber || !expirationDate || !cvv || !deliveryAddress) {
            return res.status(400).json({ message: 'UserId, numero della carta di credito, data di scadenza, CVV e indirizzo di consegna sono obbligatori.' });
        }

        // Verifica se il numero della carta di credito è nel formato corretto
        if (!isValidCardNumber(cardNumber)) {
            return res.status(400).json({ message: 'Numero della carta di credito non valido.' });
        }

        // Verifica se la data di scadenza è nel formato corretto
        if (!isValidExpirationDate(expirationDate)) {
            return res.status(400).json({ message: 'Data di scadenza non valida. Utilizzare il formato MM/YY.' });
        }

        // Verifica se il CVV è nel formato corretto
        if (!isValidCVV(cvv)) {
            return res.status(400).json({ message: 'CVV non valido. Il CVV deve essere composto da 3 o 4 cifre.' });
        }

        // Verifica se l'indirizzo di consegna è nel formato corretto
        if (!isValidAddress(deliveryAddress)) {
            return res.status(400).json({ message: 'Indirizzo di consegna non valido. Assicurati di inserire il paese, la città, la via, il numero e il nome sul campanello.' });
        }

        // Trova il carrello dell'utente
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        // Verifica se il carrello esiste e contiene degli articoli
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Il carrello è vuoto. Non ci sono articoli da acquistare.' });
        }

        // Verifica se c'è abbastanza stock per ogni prodotto nel carrello
        for (const item of cart.items) {
            if (item.product.countInStock < item.quantity) {
                return res.status(400).json({ message: `Quantità non disponibile per il prodotto: ${item.product.name}` });
            }
        }

        // Simula il pagamento impostando paymentSuccess a true
        const paymentSuccess = true;

        if (paymentSuccess) {
            // Sottrai la quantità acquistata dalla quantità disponibile per ogni prodotto nel carrello
            for (const item of cart.items) {
                item.product.countInStock -= item.quantity;
                await item.product.save(); // Salva le modifiche al prodotto nel database
            }

            // Calcola la data precisa della consegna
            const preciseDeliveryDate = calculateDeliveryDate();
              // Formatta la data precisa della consegna nel messaggio da restituire all'utente
              const formattedDeliveryDate = preciseDeliveryDate.toLocaleDateString('it-IT', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
              // Messaggio da mostrare all'utente prima della data formattata
              const message = `Il pacco sarà consegnato il girono:`;

           
            // Salva l'ordine nel database
            const order = new Order({
                userId: userId,
                items: cart.items,
                totalPrice: cart.totalPrice,
                deliveryAddress: deliveryAddress,
                createdAt: new Date(), // Data di creazione dell'ordine
                deliveryDate: preciseDeliveryDate, // Data di consegna calcolata
                status: 'In attesa di consegna', // Imposta lo stato di consegna
                paymentDetails: {
                    cardNumber: cardNumber,
                    expirationDate: expirationDate,
                    cvv: cvv
                }
            });
             // Controlla se la data attuale supera la data di consegna prevista
             if (new Date() > preciseDeliveryDate) {
                // Aggiorna lo stato dell'ordine a 'Consegnato'
                order.status = 'Consegnato';
            }

            await order.save();

            // Aggiorna il carrello dell'utente
            cart.items = [];
            cart.totalPrice = 0;
            await cart.save();

            return res.status(200).json({ 
                message: `Pagamento completato con successo. ${message} ${formattedDeliveryDate}.`, 
                deliveryDate: preciseDeliveryDate// Invia la data di consegna precisa all'utente
               // status: 'In attesa di consegna' 
            });
        } else {
            return res.status(400).json({ message: 'Pagamento non riuscito. Si prega di riprovare più tardi.' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
 router.delete('/removeFromCart/:userId/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;

        // Controlla se userId e productId sono forniti e validi
        if (!userId || !productId) {
            return res.status(400).json({ message: 'UserId e productId sono obbligatori.' });
        }

        // Trova il carrello dell'utente nel database
        const cart = await Cart.findOne({ user: userId });

        // Se il carrello non esiste, restituisci un errore
        if (!cart) {
            return res.status(404).json({ message: 'Carrello non trovato.' });
        }

        // Cerca il prodotto nel carrello
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId);

        // Se il prodotto non è presente nel carrello, restituisci un errore
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Prodotto non trovato nel carrello.' });
        }

        // Rimuovi il prodotto dal carrello
        const removedProduct = cart.items.splice(productIndex, 1)[0]; // Rimuovi e ottieni l'elemento rimosso
        const removedProductPrice = removedProduct.quantity * removedProduct.price;

        // Aggiorna il prezzo totale del carrello sottraendo il prezzo del prodotto rimosso
        cart.totalPrice -= removedProductPrice;

        // Salva il carrello aggiornato nel database
        await cart.save();

        res.status(200).json({ message: 'Prodotto rimosso con successo dal carrello.', cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});





router.put('/updateQuantity/:userId/:productId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const newQuantity = req.body.newQuantity;

        // Controlla se userId, productId e quantity sono forniti
        if (!userId || !productId || !newQuantity) {
            return res.status(400).json({ message: 'UserId, productId e newQuantity sono obbligatori.' });
        }

        // Trova il carrello dell'utente nel database
        const cart = await Cart.findOne({ user: userId });

        // Se il carrello non esiste, restituisci un errore
        if (!cart) {
            return res.status(404).json({ message: 'Carrello non trovato.' });
        }

        // Trova l'indice del prodotto nel carrello
        const productIndex = cart.items.findIndex(item => item.product.toString() === productId.toString());

        // Se il prodotto non è nel carrello, restituisci un errore
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Prodotto non trovato nel carrello.' });
        }

        // Recupera il prezzo del prodotto
        const product = await Product.findById(cart.items[productIndex].product);

        // Vecchia quantità del prodotto nel carrello
        const oldQuantity = cart.items[productIndex].quantity;

        // Aggiorna la quantità del prodotto nel carrello
        cart.items[productIndex].quantity = newQuantity;

        // Aggiorna il prezzo totale del carrello
        cart.totalPrice += (newQuantity - oldQuantity) * product.price;

        // Salva il carrello aggiornato nel database
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Aggiungi un endpoint per eliminare un ordine
router.delete('/orders/:orderId', async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
      if (deletedOrder) {
        return res.status(200).json({ message: 'Ordine eliminato con successo.' });
      } else {
        return res.status(404).json({ message: 'Ordine non trovato.' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }); 

module.exports = router;



      
  