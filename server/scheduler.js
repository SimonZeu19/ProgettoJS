// scheduler.js

const { updateOrderStatus } = require('./orderUtils'); // Importa la funzione di aggiornamento dello stato dell'ordine

// Esegui l'aggiornamento dello stato dell'ordine ogni ora (3600000 millisecondi)
setInterval(updateOrderStatus, 3600000);