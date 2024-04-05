const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Riferimento al modello User
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Riferimento al modello Product
                required: true
            },
            name: {
                type: String, 
                required: true
            },
            image: {
                type: String, 
                required: true 
            },
            description: { 
                type: String,
                required: true
            },
            brand: {
                type: String,
                required: true 
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    }, // Aggiunto il campo per l'indirizzo di consegna
    deliveryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['In attesa di consegna', 'Consegnato'],
        default: 'In attesa di consegna'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const Order = mongoose.model('Order', orderSchema);

module.exports = Order;



