// orderUtils.js

const Order = require('./models/orderModel'); // Assicurati di importare il modello Order correttamente

async function updateOrderStatus() {
    try {
        const orders = await Order.find({ status: 'In attesa di consegna', deliveryDate: { $lte: new Date() } });
        for (const order of orders) {
            order.status = 'Consegnato';
            order.deliveryDate = new Date(); // Aggiorna la data di consegna con la data corrente
            await order.save();
        }
        console.log('Stato degli ordini aggiornato con successo.');
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dello stato degli ordini:', error);
    }
}

module.exports = { updateOrderStatus };