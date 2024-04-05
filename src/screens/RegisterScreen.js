import Axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [serverErrors, setServerErrors] = useState({});
  const userRegister = useSelector(state => state.userRegister);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Controllo se le due password corrispondono
    if (password !== rePassword) {
      setErrorText("Le password non corrispondono.");
      return;
    }
   {/** // Verifica se tutti i campi sono stati inseriti
    if (!name || !email || !password || !rePassword) {
      setErrorText("Tutti i campi sono obbligatori.");
      return;
    }

    // Validazione del campo email lato client
    if (!validateEmail(email)) {
      setErrorText("Inserisci un indirizzo email valido.");
      return;
    }

    // Controllo se le due password corrispondono
    if (password !== rePassword) {
      setErrorText("Le password non corrispondono.");
      return;
    }

    // Controllo sulla lunghezza della password
    if (password.length < 6) {
      setErrorText("La password deve essere lunga almeno 6 caratteri.");
      return;
    }

    // Controllo che la password contenga almeno un numero
    if (!/\d/.test(password)) {
      setErrorText("La password deve contenere almeno un numero.");
      return;
    }

    if (/^\d+$/.test(password)) {
      setErrorText("La password non può contenere solo numeri.");
      return;
    }

    // Controllo che la password non assomigli al nome dell'utente
    if (password.includes(name)) {
      setErrorText("La password non può assomigliare al tuo nome.");
      return;
    } */}

    try {
      const { data } = await Axios.post("http://localhost:5000/api/users/register", { name, email, password });
      if (data) {
        console.log(data);
        navigate("/"); // Redirect to home if registration is successful
      }
    } catch (err) {
      console.error(err);
      // Handle specific server validation errors
      //if (err.response && err.response.data && err.response.data.message === "Questo indirizzo email è già in uso.") {
       // setErrorText("Questo indirizzo email è già in uso.");
      if (err.response && err.response.data && err.response.data.message) {
        setErrorText(err.response.data.message);
      } else {
        setErrorText("Errore durante la registrazione. Riprova più tardi.");
      }
    }
  }

  const validateEmail = (email) => {
    // Utilizza un'espressione regolare per controllare se l'email è valida
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  return (
    <div>
        {/* Navbar */}
        <nav style={{ backgroundColor: '#333', color: '#fff', padding: '30px 50px', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: '0' }}>E-Shop</h2>
        <div>
          <Link to="/" style={{ color: '#fff', marginRight: '10px' }}>Home</Link>
          <Link to="/signin" style={{ color: '#fff', marginRight: '10px' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Registrati</Link>
        </div>
      </nav>
   
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <h2>Registrazione</h2>
          </li>
          <li>
            {errorText && <div className="error-message" style={{ color: 'red' }}>{errorText}</div>}
          </li>
          <li>
            <label htmlFor="name">Nome</label>
            <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} />
          </li>
          <li>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
          </li>
          <li>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
          </li>
          <li>
            <label htmlFor="rePassword">Re-enter Password</label>
            <input type="password" id="rePassword" name="rePassword" onChange={(e) => setRePassword(e.target.value)} />
          </li>
          <li>
            <button type="submit" className="button primary">Registrati</button>
          </li>
          <li>Ti sei già Registrato?</li>
          <li>
            <Link to="/signin" className="button secondary text-center">Accedi</Link>
          </li>
        </ul>
      </form>
    </div>
    </div>
  );
}

export default RegisterScreen;



{/** 
import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';

function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [serverErrors, setServerErrors] = useState({});
  const userRegister = useSelector(state => state.userRegister);
  //const { loading, userInfo, error } = userRegister;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  {/** useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
  
    // Validazione del campo email lato client
    if (!validateEmail(email)) {
      setErrorText("Inserisci un indirizzo email valido.");
      return;
    }
  
    // Controllo se le due password corrispondono
    if (password !== rePassword) {
      setErrorText("Le password non corrispondono.");
      return;
    }
  
    try {
      const { data } = await Axios.post("http://localhost:5000/api/users/register", { name, email, password });
      if (data) {
        console.log(data);
        navigate("/"); // Redirect to home if registration is successful
      }
    } catch (err) {
      console.error(err);
      // Handle specific server validation errors
      if (err.response && err.response.data && err.response.data.message === "Questo indirizzo email è già in uso.") {
        setErrorText("Questo indirizzo email è già in uso.");
      } else {
        setErrorText("Errore durante la registrazione. Riprova più tardi.");
      }
    }
  }
  
  // Funzione per la validazione dell'email
  const validateEmail = (email) => {
    // Utilizza un'espressione regolare per controllare se l'email è valida
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }



  return (
    <div className="form">
      <form onSubmit={submitHandler}>
        <ul className="form-container">
          <li>
            <h2>Registrazione</h2>
          </li>
          <li>
           {/** {loading && <div>Loading...</div>} 
            {errorText && <div className="error-message">{errorText}</div>}
          </li>
          <li>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" onChange={(e) => setName(e.target.value)} />
            {serverErrors && serverErrors.name && <div className="error-message">{serverErrors.name}</div>}
          </li>
          <li>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} />
            {serverErrors && serverErrors.email && <div className="error-message">{serverErrors.email}</div>}
          </li>
          <li>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
            {serverErrors && serverErrors.password && <div className="error-message">{serverErrors.password}</div>}
          
          </li>
          <li>
            <label htmlFor="rePassword">Re-enter Password</label>
            <input type="password" id="rePassword" name="rePassword" onChange={(e) => setRePassword(e.target.value)} />
            {serverErrors && serverErrors.rePassword && <div className="error-message">{serverErrors.rePassword}</div>}
          </li>
          <li>
            <button type="submit" className="button primary">Register</button>
          </li>
          <li>Already have an account?</li>
          <li>
            <Link to="/signin" className="button secondary text-center">Sign In</Link>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default RegisterScreen;
*/}





