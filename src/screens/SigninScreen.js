import Axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../actions/userActions';

function SigninScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("http://localhost:5000/api/users/signin", { email, password });
      if (data) {
        const loggedInUserId = data._id;
        setUserId(loggedInUserId);
        localStorage.setItem('userId', loggedInUserId);
        
        if (data.isAdmin) {
          navigate(`/dashboard?welcome=Login successful. Welcome, ${data.name}!`);
        } else {
          navigate(`/users/${loggedInUserId}?welcome=Login successful. Welcome, ${data.name}!`);
        }
        setMessage(`Login successful. Welcome, ${data.name}!`);
      }
    } catch (err) {
      console.error(err);
      setErrorText("Email or password incorrect. Please try again.");
    }
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
            <h2>Accedi</h2>
          </li>
          <li>
          {errorText && <div className="error-message" style={{ color: 'red' }}>{errorText}</div>}
            {message && <div className="success-message">{message}</div>} {/* Aggiungi questo div per visualizzare il messaggio */}
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
            <button type="submit" className="button primary">Accedi</button>
          </li>
          <li>Mai fatto l'accesso su E-Shop?</li>
          <li>
            <Link to="/register" className="button secondary text-center">Crea il tuo account E-Shop</Link>
          </li>
        </ul>
      </form>
    </div>
    </div>
  );
}

export default SigninScreen;












