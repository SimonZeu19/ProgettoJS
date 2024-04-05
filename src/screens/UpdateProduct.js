import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from './AdminNavbar';
import AdmindFooter from './AdminFooter';

function UpdateProduct() {
    const { id } = useParams();
    
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
     
   // Utilizza useEffect per eseguire una funzione fetchData ogni volta che l'ID del prodotto cambia
useEffect(() => {
    // Definisce la funzione fetchData che effettua una richiesta GET per ottenere i dettagli del prodotto dal server
    const fetchData = async () => {
        try {
            // Effettua una richiesta GET all'API per ottenere i dettagli del prodotto con l'ID specificato
            const response = await axios.get(`http://localhost:5000/api/products/getProduct/${id}`);
            // Imposta lo stato del componente con i dati del prodotto ottenuti dalla risposta
            setName(response.data.name);
            setImage(response.data.image);
            setDescription(response.data.description);
            setPrice(response.data.price);
            setBrand(response.data.brand);
            setCountInStock(response.data.countInStock);
        } catch(err) {
            // Gestisce eventuali errori durante il recupero dei dati del prodotto impostando uno stato di errore
            console.error("Error fetching product:", err);
            setErrorMessage("Error fetching product. Please try again.");
        }
    };

    // Chiama la funzione fetchData quando l'ID del prodotto cambia
    fetchData();
}, [id]);
     
    const navigate = useNavigate();
 
    const handleUpdate = async (e) => {
        e.preventDefault();
         // Verifica che i campi obbligatori siano stati compilati
    if (!name || !image || !description || !price || !brand || !countInStock) {
        setErrorMessage('Tutti i campi sono obbligatori.');
        return;
    }

         // Verifica che il prezzo e la quantità non siano negativi
        if (price < 0 || countInStock < 0) {
            setErrorMessage('Il prezzo e la quantità del prodotto non possono essere negativi.');
            return;
        }
        
        try {
            // Effettua una richiesta PUT per aggiornare il prodotto
            await axios.put(`http://localhost:5000/api/products/updateProduct/${id}`, {
                name,
                image,
                description,
                price,
                brand,
                countInStock
            });
    
            navigate('/getproducts');
        } catch(err) {
            if (err.response && err.response.data && err.response.data.message) {
                setErrorMessage(err.response.data.message);
            } else {
                console.error("Error updating product:", err);
                setErrorMessage("Error updating product. Please try again.");
            }
        }
    };
 
    return ( 
        <div>
        <AdminNavbar/>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleUpdate}>
                    <h2>Aggiorna Prodotto</h2>
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
                        <label htmlFor="">URL dell'immagine</label>
                        <input
                            type="text"
                            placeholder="Enter Image URL"
                            className="form-control"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Descrizione</label>
                        <textarea
                            placeholder="Enter Description"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Prezzo</label>
                        <input
                            type="number"
                            placeholder="Enter Price"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Brand</label>
                        <input
                            type="text"
                            placeholder="Enter Brand"
                            className="form-control"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="">Quantità Disponibile</label>
                        <input
                            type="number"
                            placeholder="Enter Count in Stock"
                            className="form-control"
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-success">Aggiorna</button>
                   
                </form>
            </div>
            </div>
        </div>
        <AdmindFooter/>
        </div>
    );
}
 
export default UpdateProduct;