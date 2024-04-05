import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

function UpdateUser() {
    const { id } = useParams();
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
     
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/getone/${id}`);
                setName(response.data.name);
                setEmail(response.data.email);
                setPassword(response.data.password);
            } catch(err) {
                console.error("Error fetching user:", err);
                setErrorMessage("Error fetching user. Please try again.");
            }
        };
        fetchData();
    }, [id]);
     
    const navigate = useNavigate();
 
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

  
        try {
            await axios.put(`http://localhost:5000/api/users/updateUser/${id}`, { name, email, password });
            navigate('/getusers');
        } catch(err) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                console.error("Error updating user:", err);
                setErrorMessage("Error updating user. Please try again.");
            }
            //console.error("Error updating user:", err);
            //setErrorMessage("Errore durante l'aggiornamento dell'utente. Riprova di nuovo");
        } finally {
            setLoading(false);
        }
    };




    return (
        <div>
        <AdminNavbar/> 
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleUpdate}>
                    
                    <h2>Aggiorna Utente</h2>
                    {errorMessage && <p className="text-danger mt-2" style={{ color: 'red' }}>{errorMessage}</p>}
                    <div className="mb-2">
                        <label htmlFor="">Nome</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Email</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success">Aggiorna</button>
                   
                </form>
            </div>
        </div>
        </div>
        <AdminFooter/>
        </div>
        
    );
}
 
export default UpdateUser;










