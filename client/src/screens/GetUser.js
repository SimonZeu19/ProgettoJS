import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';


function GetUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/getone/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error retrieving user.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <AdminNavbar/>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div>
      <h2>Info Utente</h2>
      <p><strong>ID:</strong> {user._id}</p>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Password:</strong> {user.password}</p>

      {/* Add more user details as needed */}
    </div>
    </div>
    <AdminFooter/>
    </div>
  );
}

export default GetUser;