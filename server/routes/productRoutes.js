const  express = require  ('express');
const Product =require('../models/productModel');
const mongoose = require('mongoose');


const router = express.Router();
const expressAsyncHandler = require('express-async-handler');



router.get('/getProducts', async (req, res) => {
  try {
    const products = await Product.find().select();
    if (products.length === 0) {
      return res.status(404).json({ message: 'Nessun prodotto trovato nel database.' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/addProduct', async (req, res) => {
  try {
    // Verifica se la quantità countInStock è un numero intero e maggiore o uguale a zero
    const countInStock = parseInt(req.body.countInStock);
    if (isNaN(countInStock) || countInStock < 0 || !Number.isInteger(countInStock)) {
      return res.status(400).json({ message: 'La quantità in stock deve essere un numero intero maggiore o uguale a zero' });
    }
    // Verifica se la quantità in stock contiene cifre decimali
if (/\./.test(req.body.countInStock)) {
  return res.status(400).json({ message: 'La quantità in stock non può contenere numeri decimali' });
}

    // Controlla se esiste già un prodotto con lo stesso nome o la stessa immagine
    const existingProduct = await Product.findOne({ $or: [{ name: req.body.name }, { image: req.body.image }] });
    if (existingProduct) {
      // Se il prodotto esiste già, restituisci un messaggio di errore al client
      return res.status(400).json({ message: 'Un prodotto esiste già nel database con lo stesso nome o la stessa immagine' });
    }

    // Crea un nuovo prodotto solo se non esiste già nel database
    const newProduct = new Product({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
      countInStock: countInStock,
    });

    // Salva il nuovo prodotto nel database
    const savedProduct = await newProduct.save();

    // Restituisci il nuovo prodotto come risposta
    res.status(201).json(savedProduct);
  } catch (error) {
    // Se si verifica un errore durante il salvataggio del prodotto, restituisci un messaggio di errore
    res.status(500).json({ message: 'Errore durante l\'aggiunta del prodotto', error: error.message });
  }
});






router.get('/getProduct/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      return res.status(200).json({ message: 'Product Deleted' });
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


router.put('/updateProduct/:id', async (req, res) => {
  try {
     // Verifica se la quantità countInStock è un numero intero e maggiore o uguale a zero
     const countInStock = parseInt(req.body.countInStock);
     if (isNaN(countInStock) || countInStock < 0 || !Number.isInteger(countInStock)) {
       return res.status(400).json({ message: 'La quantità in stock deve essere un numero intero maggiore o uguale a zero' });
     }
     // Verifica se la quantità in stock contiene cifre decimali
 if (/\./.test(req.body.countInStock)) {
   return res.status(400).json({ message: 'La quantità in stock non può contenere numeri decimali' });
 }
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: 'Prodotto non trovato' });
    }

    // Controlla se esiste già un prodotto con lo stesso nome o la stessa immagine diverso dall'attuale prodotto
    const existingProduct = await Product.findOne({ $and: [{ _id: { $ne: productId } }, { $or: [{ name: req.body.name }, { image: req.body.image }] }] });
    if (existingProduct) {
      return res.status(400).json({ message: 'Un prodotto esiste già nel database con lo stesso nome o la stessa immagine' });
    }

    // Aggiorna il prodotto
    product.name = req.body.name;
    product.image = req.body.image;
    product.description = req.body.description;
    product.price = req.body.price;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;

    const updatedProduct = await product.save();
    return res.status(200).send({ message: 'Prodotto aggiornato', data: updatedProduct });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'ID prodotto non valido' });
    }
    return res.status(500).json({ error: error.message, message: 'Errore nell\'aggiornamento del prodotto.' });
  }
});
module.exports= router;