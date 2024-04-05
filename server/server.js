
const express = require('express')
const mongoose= require('mongoose')
const dotenv= require('dotenv')
const cors = require('cors');
const productRouter= require('./routes/productRoutes.js')
const userRouter= require('./routes/userRoutes.js')
const scheduler = require('./scheduler'); // Importa il modulo scheduler

const  cartRouter= require('./routes/cartRoutes.js')
const app = express()
dotenv.config();
require('dotenv').config({path:'./config/.env'})
require('./config/db');

app.use(cors());

app.listen(process.env.PORT, ()=>{
    console.log(`Listening on port ${process.env.PORT}`);
})

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

{/** app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    const username = req.session.user.name;
    res.send(`Benvenuto, ${username}!`);
  } else {
    res.redirect('/signin'); // Reindirizza l'utente al login se non è autenticato
  }
});*/}

/*mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });*/
  mongoose
    .connect('mongodb+srv://simonzeu19:Mern1234@cluster1.pa1keku.mongodb.net/mern-ecomerce')
    .then(()=> console.log("Connected to mongodb"))
    .catch((err)=> console.log("Faill to connect to mongoDB", err));




app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

app.use("/api/cart", cartRouter);




app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

