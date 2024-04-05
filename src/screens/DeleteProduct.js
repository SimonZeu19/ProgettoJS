import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";


function DeleteProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false); // Stato per gestire la visualizzazione del popup di conferma

    const handleDelete = async () => {
        try {
            const response = await axios.delete("http://localhost:5000/api/products/deleteProduct/" + id);
            if (response.status === 200) {
                setMessage('Product deleted successfully.');
                navigate('/getproducts'); // Dopo la cancellazione, naviga alla pagina dei prodotti
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage('Product not found.');
            } else {
                setMessage('Error deleting product.');
            }
        }
    };

    return (
        <div>
            
            <h2>Elimina prodotto</h2>
            <button onClick={() => setShowConfirmation(true)}>Elimina</button>
            {message && <p>{message}</p>}
            {/* Visualizza il popup di conferma solo se showConfirmation è true */}
            {showConfirmation && (
                <div className="confirmation-modal">
                    <p>Sei sicuro di voler eliminare questo prodotto?</p>
                    <button onClick={handleDelete}>Si</button>
                    <button onClick={() => setShowConfirmation(false)}>No</button>
                </div>
            )}
           
        </div>
    );
};

export default DeleteProduct;