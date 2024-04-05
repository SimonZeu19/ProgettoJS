const mongoose = require('mongoose');

// Definizione dello schema per un elemento nel carrello
const cartItemSchema = new mongoose.Schema({
  // Riferimento all'ID del prodotto associato
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  // La quantità di questo prodotto nel carrello
  quantity: { type: Number, required: true, default: 1 },
  // Prezzo unitario del prodotto
  price: { type: Number, required: true },// Aggiunto il prezzo del prodotto
  
  countInStock: { type: Number, required: true },


   
});

// Definizione dello schema per il carrello completo
const cartSchema = new mongoose.Schema({
  // Riferimento all'ID dell'utente proprietario del carrello
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Array di elementi nel carrello
  items: [cartItemSchema],
  // Il prezzo totale del carrello
  totalPrice: { type: Number, required: true, default: 0 },
}, { timestamps: true }); 

// Creazione del modello Mongoose per il carrello
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;




