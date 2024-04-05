import React, { useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

function CreateAdmin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

  

    try {
      const response = await axios.post('http://localhost:5000/api/users/createAdmin', {
        name,
        email,
        password
      });

      if (response.status === 201) {
        setMessage('Admin creato con successo.');
        navigate('/getusers');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message)
        //setMessage('Email già esistente.');
      } else {
        setMessage('Errore durante la creazione dell\'amministratore.');
      }
    }
  };


  return (
    <div>
      <AdminNavbar/>
     
      <h2  style={{ display: 'flex', justifyContent: 'center' }}>Crea Admin</h2>
      {message && <p style={{ display: 'flex', justifyContent: 'center', color: 'red'}}>{message}</p>}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input type="text"  placeholder="Inserisci Nome" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" placeholder="Inserisci email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" placeholder="Inserisci Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit"   className='btn-dark'>Crea Admin</button>
      </form>
     
      </div>
      <AdminFooter/>
    </div>
  );
}

export default CreateAdmin;