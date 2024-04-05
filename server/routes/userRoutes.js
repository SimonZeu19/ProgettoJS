const express =require('express');
const User=require('../models/userModel');
const { getToken, isAuth } =require('../utils');
const bcrypt = require('bcrypt');
const Order = require('../models/orderModel'); // Assicurati di importare il modello dell'ordine


const router = express.Router();



router.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find().select();
    if (users.length === 0) {
      return res.status(404).json({ message: 'Nessun utente trovato nel database.' });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/signin', async (req, res) => {
  const signinUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (signinUser) {
    // Imposta il flag isLoggedIn a true nella sessione
    req.session.isLoggedIn = true;
    res.send({
      _id: signinUser.id,
      name: signinUser.name,
      email: signinUser.email,
      isAdmin: signinUser.isAdmin,
      token: getToken(signinUser),
      message:{ 'Login successful. Welcome!': signinUser.name}
    });
  } else {
    res.status(401).send({ message: 'Invalid Email or Password.' });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
     // Verifica se tutti i campi obbligatori sono stati forniti
     if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    // Controllo sulla lunghezza della password
    if (password.length < 6) {
      return res.status(400).json({ message: 'La password deve essere lunga almeno 6 caratteri.' });
    }

    // Controllo che la password contenga almeno un numero
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'La password deve contenere almeno un numero.' });
    }
    // Controllo che la password non contenga solo numeri
     if (/^\d+$/.test(password)) {
        return res.status(400).json({ message: 'La password non può contenere solo numeri.' });
    }

    // Controllo che la password non assomigli al nome dell'utente
    if (password.includes(name)) {
      return res.status(400).json({ message: 'La password non può assomigliare al tuo nome.' });
    }

   

    // Controlla se l'email è già presente nel database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Questo indirizzo email è già in uso.' });
    }

    // Altrimenti, crea un nuovo utente nel database
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Utente registrato con successo.' });
  } catch (error) {
    console.error(error);
    // Gestisci altri tipi di errori qui
    res.status(500).json({ message: 'Errore durante la registrazione dell\'utente.' });
  }
});



{/** router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Verifica se tutti i campi obbligatori sono stati forniti
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }
    // Controlla se l'email è già presente nel database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Questo indirizzo email è già in uso.' });
    }
    // Altrimenti, crea un nuovo utente nel database
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Utente registrato con successo.' });
  } catch (error) {
    console.error(error);
    // Gestisci altri tipi di errori qui
    res.status(500).json({ message: 'Errore durante la registrazione dell\'utente.' });
  }
});*/}


router.post('/logout', (req, res) => {
  // Cancella la sessione sul server
  req.session.destroy((err) => {
    if (err) {
      console.error('Errore durante il logout:', err);
      res.status(500).send('Errore durante il logout');
    } else {
      res.send('Logout effettuato con successo');
    }
  });
});


// Funzione per validare l'email
function isValidEmail(email) {
  // Implementa la tua logica per la validazione dell'email qui
  // Ad esempio, puoi utilizzare una espressione regolare per verificare il formato dell'email
  return /\S+@\S+\.\S+/.test(email);
}

router.post('/createAdmin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Controllo che tutti i campi siano stati forniti
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    // Controllo che l'email sia valida
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email non valida.' });
    }

    // Controllo che la password rispetti i requisiti minimi
    if (password.length < 6) {
      return res.status(400).json({ message: 'La password deve essere lunga almeno 6 caratteri.' });
    }

    // Controllo che la password contenga almeno un numero
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'La password deve contenere almeno un numero.' });
    }

    // Controllo che la password non contenga solo numeri
    if (/^\d+$/.test(password)) {
      return res.status(400).json({ message: 'La password non può contenere solo numeri.' });
    }

    // Controlla se l'email è già presente nel database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già in uso.' });
    }

    // Crea un nuovo utente admin
    const newUser = new User({
      name,
      email,
      password,
      isAdmin: true,
    });

    // Salva il nuovo utente nel database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante la creazione dell\'amministratore.' });
  }
});





router.get('/getone/:id', async (req, res) => {

  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(400).json({msg: "user not found"});
    }
    res.status(200).json(userExist);

  } catch (error) {
    res.status(500).json({error: error});
  }
});

router.post('/createUser', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Controllo sulla lunghezza della password
    if (password.length < 6) {
      return res.status(400).json({ message: 'La password deve essere lunga almeno 6 caratteri.' });
    }

    // Controllo che la password contenga almeno un numero
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'La password deve contenere almeno un numero.' });
    }
    // Controllo che la password non contenga solo numeri
     if (/^\d+$/.test(password)) {
        return res.status(400).json({ message: 'La password non può contenere solo numeri.' });
    }

    // Controllo che la password non assomigli al nome dell'utente
    if (password.includes(name)) {
      return res.status(400).json({ message: 'La password non può assomigliare al tuo nome.' });
    }

    // Verifica se tutti i campi obbligatori sono stati forniti
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    // Controlla se l'email è già presente nel database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Questo indirizzo email è già in uso.' });
    }

    // Altrimenti, crea un nuovo utente nel database
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Utente aggiunto con successo.' });
  } catch (error) {
    console.error(error);
    // Gestisci altri tipi di errori qui
    res.status(500).json({ message: 'Errore durante l\'aggiunta dell\'utente.' });
  }
});





router.delete('/deleteUser/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
      return res.status(200).json({ message: 'User Deleted' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});




router.put('/updateUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    // Controllo sulla lunghezza della password
    if (password.length < 6) {
      return res.status(400).json({ message: 'La password deve essere lunga almeno 6 caratteri.' });
    }

    // Controllo che la password contenga almeno un numero
    if (!/\d/.test(password)) {
      return res.status(400).json({ message: 'La password deve contenere almeno un numero.' });
    }

    // Controllo che la password non contenga solo numeri
    if (/^\d+$/.test(password)) {
      return res.status(400).json({ message: 'La password non può contenere solo numeri.' });
    }

    // Controllo che la password non assomigli al nome dell'utente
    if (password.includes(name)) {
      return res.status(400).json({ message: 'La password non può assomigliare al tuo nome.' });
    }

    // Verifica se tutti i campi obbligatori sono stati forniti
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    // Controlla se l'email è già presente nel database, escludendo l'utente che si sta aggiornando
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Questo indirizzo email è già in uso.' });
    }

    // Altrimenti, aggiorna l'utente nel database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    // Aggiornamento dei dati dell'utente
    user.name = name;
    user.email = email;
    user.password = password;

    await user.save();
    res.status(200).json({ message: 'Utente aggiornato con successo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'utente.' });
  }
});



router.get('/orders/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;

      // Recupera gli ordini dell'utente dal database
      const orders = await Order.find({ userId: userId });

      // Restituisci gli ordini come risposta
      return res.status(200).json(orders);
      
     
  } catch (error) {
      // Gestisci gli errori
      return res.status(500).json({ error: error.message });
  }
});


// Rotta per recuperare gli ordini di un utente specifico come admin
router.get('/admin/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Recupera gli ordini dell'utente dal database
    const orders = await Order.find({ userId: userId });

    // Restituisci gli ordini come risposta
    return res.status(200).json(orders);
  } catch (error) {
    // Gestisci gli errori
    return res.status(500).json({ error: error.message });
  }
});

router.put('/updateProfile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password } = req.body;

    // Verifica che l'utente stia cercando di modificare il proprio profilo
    if (req.user && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Non hai il permesso per aggiornare questo profilo.' });
    }

    // Controllo sulla lunghezza della password
    if (password && password.length < 6) {
      return res.status(400).json({ message: 'La password deve essere lunga almeno 6 caratteri.' });
    }

    // Controllo che la password contenga almeno un numero
    if (password && !/\d/.test(password)) {
      return res.status(400).json({ message: 'La password deve contenere almeno un numero.' });
    }

    // Controllo che la password non contenga solo numeri
    if (password && /^\d+$/.test(password)) {
      return res.status(400).json({ message: 'La password non può contenere solo numeri.' });
    }

    // Controllo che la password non assomigli al nome dell'utente
    if (password && password.includes(name)) {
      return res.status(400).json({ message: 'La password non può assomigliare al tuo nome.' });
    }

    // Verifica se tutti i campi obbligatori sono stati forniti
    if (!name || !email) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    // Controlla se l'email è già presente nel database, escludendo l'utente che si sta aggiornando
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'Questo indirizzo email è già in uso.' });
    }

    // Altrimenti, aggiorna l'utente nel database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    // Aggiornamento dei dati dell'utente
    user.name = name;
    user.email = email;
    if (password) {
      user.password = password;
    }

    await user.save();
    res.status(200).json({ message: 'Profilo aggiornato con successo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo.' });
  }
});


module.exports= router;








