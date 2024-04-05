import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter"
//import './User.css'
 
function AddUser() {
 
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
      
        // Verifica se i campi sono vuoti
  if (!name || !email || !password) {
    setError('I campi devono essere compilati');
    setLoading(false);
    return; // Esce dalla funzione se i campi sono vuoti
  }
  try {
    const res = await axios.post('http://localhost:5000/api/users/createUser', {
      name: name,
      email: email,
      password: password
    });
  
    //console.log("Risposta dal server:", res);
  
    if (res.status === 201) {
      // Se lo status della risposta è 201, significa che l'utente è stato creato con successo
      navigate('/getusers');
      }
    } catch (err) {
      if (err.response && err.response.status === 400 && err.response.data && err.response.data.message) {
        // Se lo status della risposta è 400 e contiene un messaggio di errore, lo mostro all'utente
        //questi messaggio di errori sone quelli del backend
        setError(err.response.data.message);
      } else {
        setError('Si è verificato un errore durante la creazione dell\'utente');
      }
    } finally {
      setLoading(false);
    }
  };

     
       return (
        <div >
          <AdminNavbar/>
        
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="vh-100 bg-primary d-flex justify-content-center align-items-center">
            <div className="bg-white rounded p-3">
              <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                <h2>Aggiungi Utente</h2>
                <p> {error && <div className="alert alert-danger"style={{ display: 'flex', justifyContent: 'center',color: 'red' }}>{error}</div>}</p>
                <div className="mb-2">
                  <label htmlFor="name">Nome</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Inserisci Nome"
                    className="form-control"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Inserisci Email"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Inserisci Password"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-dark">Crea Utente</button>
              </form>
            </div>
          </div>
          </div>
          <AdminFooter/>
        </div>
      );
}
 
export default AddUser;


