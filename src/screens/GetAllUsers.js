import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from "react-router-dom";
import './User.css';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

function Users() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/getusers');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    setShowConfirmation(true);
    setUserIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete('http://localhost:5000/api/users/deleteUser/' + userIdToDelete);
      setData(prevUsers => prevUsers.filter(user => user._id !== userIdToDelete));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const filteredUsers = data.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );


{/** Funziona, fa vedere la tabella di tutti gli utenti nel database
  return (
    <div style={{ minHeight: '150vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AdminNavbar />
      <div className="flex-grow-1 bg-primary justify-content-center align-items-center" style={{ marginBottom: '50px' }}>
        <div className="w-50 bg-white rounded p-3">
          <div className="text-center">
            <button>
              <Link to="/createUser" className="btn btn-dark text-light">Aggiungi Utente +</Link>
            </button>
            <button>
              <Link to="/createAdmin" className="btn btn-dark text-light">Aggiungi Admin+</Link>
            </button>
          </div>
          {/* Aggiungi la barra di ricerca 
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Cerca utenti..."
            style={{ marginBottom: '20px' }}
          />
          <table className="table">
            <thead>
              <tr>
                <th>id</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Password</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  
                  <td>
                    <button>
                      <Link to={`/getone/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                      </Link>
                    </button>
                    <button>
                      <Link to={`/admin/orders/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                          <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                        </svg>
                      </Link>
                    </button>
                    <button>
                      <Link to={`/updateUser/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen-fill" viewBox="0 0 16 16">
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                        </svg>
                      </Link>
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="btn btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showConfirmation && (
          <div className="confirmation-modal">
            <p>Sei sicuro di voler cancellare questo utente?</p>
            <button onClick={confirmDelete}>Sì</button>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '50px' }}>
        <AdminFooter />
      </div>
    </div>
  );*/}

  return (
    <div style={{ minHeight: '150vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <AdminNavbar />
      <div className="flex-grow-1 bg-primary justify-content-center align-items-center" style={{ marginBottom: '50px' }}>
        <div className="w-50 bg-white rounded p-3">
          <div className="text-center">
            <button>
              <Link to="/createUser" className="btn btn-dark text-light">Aggiungi Utente +</Link>
            </button>
            <button>
              <Link to="/createAdmin" className="btn btn-dark text-light">Aggiungi Admin+</Link>
            </button>
          </div>
          {/* Aggiungi la barra di ricerca */}
         <center> <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Cerca utenti..."
            style={{marginTop: '20px', marginBottom: '20px' }}
          />
          </center>
          <h2  style={{ textAlign: 'center', marginTop: '20px' }}>AMMINISTRATORI</h2>
          <table className="table">
            <thead>
              <tr>
                <th>id</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Password</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {/* Amministratori */}
              {filteredUsers.filter(user => user.isAdmin).map((user, index) => (
                <tr key={index}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  
                  <td>
                    <button>
                      <Link to={`/getone/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                      </Link>
                    </button>
                    {/* Aggiungi altri bottoni per amministratori se necessario */}
                   
                    <button>
                      <Link to={`/updateUser/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen-fill" viewBox="0 0 16 16">
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                        </svg>
                      </Link>
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="btn btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Utenti</h2>
          <table className="table">
            <thead>
              <tr>
                <th>id</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Password</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>

              {/* Utenti */}
              {filteredUsers.filter(user => !user.isAdmin).map((user, index) => (
                <tr key={index}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  
                  <td>
                    <button>
                      <Link to={`/getone/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                        </svg>
                      </Link>
                    </button>
                    {/* Aggiungi altri bottoni per utenti se necessario */}
                    <button>
                      <Link to={`/admin/orders/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
                          <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                        </svg>
                      </Link>
                    </button>
                    <button>
                      <Link to={`/updateUser/${user._id}`} className="btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen-fill" viewBox="0 0 16 16">
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                        </svg>
                      </Link>
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="btn btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
         
        </div>
        {showConfirmation && (
          <div className="confirmation-modal">
            <p>Sei sicuro di voler cancellare questo utente?</p>
            <button onClick={confirmDelete}>Sì</button>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '50px' }}>
        <AdminFooter />
      </div>
    </div>
  );
}

export default Users;





