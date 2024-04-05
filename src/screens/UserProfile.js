import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import NavbarUser from "./NavbarUser";
import FooterUser from "./FooterUser";

function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const passwordRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      setErrorMessage("UserID non trovato in localStorage.");
      return;
    }

    setUserId(storedUserId);
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/getone/${storedUserId}`
        );
        const userData = response.data;
        setName(userData.name);
        setEmail(userData.email);
        setPassword(userData.password);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorMessage("Error fetching user profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/users/updateProfile/${userId}`, {
        name,
        email,
        password: passwordRef.current.value,
      });
      setSuccessMessage("Profilo aggiornato con successo!");
      setErrorMessage(""); // Nasconde il messaggio di errore
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error("Error updating user:", error);
        setErrorMessage("Error updating user. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavbarUser />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="container">
          <div className="row justify-content-center mt-5">
            <div className="col-md-6">
              <div className="card">
                <h2 className="card-header">Il Mio Profilo</h2>
                {(errorMessage || successMessage) && (
                  <div className={`alert ${errorMessage ? "alert-danger" : "alert-success"}`} role="alert"style={{ color: errorMessage ? 'red' : 'green' }}>
                    {errorMessage || successMessage}
                  </div>
                )}
                <div className="card-body">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Nuova Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          ref={passwordRef}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Nascondi" : "Mostra"}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Aggiornamento in corso..." : "Aggiorna Profilo"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterUser />
    </div>
  );
}

export default UserProfile;




{/**import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarUser from "./NavbarUser";
import FooterUser from "./FooterUser";

function UserProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Stato per la visualizzazione della password
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      setErrorMessage("UserID non trovato in localStorage.");
      return;
    }

    setUserId(storedUserId);
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/getone/${storedUserId}`
        );
        const userData = response.data;
        setName(userData.name);
        setEmail(userData.email);
        setPassword(userData.password);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorMessage("Error fetching user profile. Please try again.");
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:5000/api/users/updateProfile/${userId}`, {
        name,
        email,
        password,
      });
     // setErrorMessage("Profilo aggiornato con successo!");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error("Error updating user:", error);
        setErrorMessage("Error updating user. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavbarUser />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="container">
          <div className="row justify-content-center mt-5">
            <div className="col-md-6">
              <div className="card">
                <h2 className="card-header">Il Mio Profilo</h2>
                {errorMessage && (
                  <div className="alert alert-danger" role="alert" style={{ color: 'red' }}>
                    {errorMessage}
                  </div>
                )}
                <div className="card-body">
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Nome
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Nuova Password
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"} // Cambia il tipo del campo password in base allo stato showPassword
                          className="form-control"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)} // Cambia lo stato showPassword quando il pulsante viene cliccato
                        >
                          {showPassword ? "Nascondi" : "Mostra"}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Aggiornamento in corso..." : "Aggiorna Profilo"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterUser />
    </div>
  );
}

export default UserProfile; */}

{/**import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavbarUser from './NavbarUser';
import FooterUser from './FooterUser';

function UserProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(""); // Aggiunta della variabile di stato userId

    useEffect(() => {
        // Recupera l'ID dell'utente memorizzato in localStorage
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            setErrorMessage("UserID non trovato in localStorage.");
            return;
        }

        setUserId(storedUserId); // Imposta l'ID dell'utente come stato
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/getone/${storedUserId}`);
                const userData = response.data;
                setName(userData.name);
                setEmail(userData.email);
                setPassword(userData.password);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setErrorMessage("Error fetching user profile. Please try again.");
            }
        };

        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            // Effettua una richiesta PUT per aggiornare il profilo utente
            await axios.put(`http://localhost:5000/api/users/updateProfile/${userId}`, { name, email, password });
            // Se l'aggiornamento è riuscito, mostra un messaggio di successo
            setErrorMessage("Profilo aggiornato con successo!");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                console.error("Error updating user:", error);
                setErrorMessage("Error updating user. Please try again.");
            }
        } finally {
            setLoading(false); // Imposta lo stato di loading su false indipendentemente dall'esito dell'aggiornamento
        }
    };
    return (
        <div>
            
            <NavbarUser />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
            
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card">
                            <h2 className="card-header">Il Mio Profilo</h2>
                            {errorMessage && <div className="alert alert-danger" role="alert" >{errorMessage}</div>}
                            <div className="card-body">
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Nome</label>
                                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Nuova Password</label>
                                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                  
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Aggiornamento in corso..." : "Aggiorna Profilo"}
                                    </button>
                                 
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <FooterUser />
        </div>
    );
}

export default UserProfile; */}