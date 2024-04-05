import { useState } from 'react';
import axios from 'axios';

function UpdateQuantityProduct({ userId, productId, onQuantityUpdated  }) {
    const [quantity, setQuantity] = useState(1); // Aggiungi stato per la quantità
    const [error, setError] = useState(null); // Stato per gli errori

    const handleUpdate = async (e) => {
        e.preventDefault();

        
        {/** // Controllo se la quantità è inferiore a 1
        if (quantity < 1) {
            setError("La quantità deve essere almeno 1.");
            return;
        }*/}

        // Effettua una richiesta PUT all'API per aggiornare la quantità del prodotto nel carrello
        try {
            await axios.put(`http://localhost:5000/api/cart/updateQuantity/${userId}/${productId}`, {
                userId: userId,
                productId: productId,
                newQuantity: quantity
            });
             // Emetti l'evento per indicare che la quantità è stata aggiornata
             onQuantityUpdated();
            // Naviga alla pagina successiva o esegui altre azioni di successo
        } catch(err) {
            console.error("Error updating product quantity:", err);
            // Gestisci l'errore e fornisce un feedback all'utente, se necessario
        }
    };
    
 
    return ( 
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleUpdate}>
                    <h2>Cambia quantita</h2>
                    
                    <div className="mb-2">
                        <label htmlFor=""></label>
                        <input
                            type="number"
                            placeholder="Enter Quantity"
                            className="form-control"
                            value={quantity}
                            min="1" // Imposta il valore minimo consentito
                            onChange={(e) => setQuantity(e.target.value)}// Assicura che il valore sia almeno 1
                        />
                        
                    </div>
                 {/**   {error && <p className="text-danger">{error}</p>} serve per fare uscire il messaggio di errore sulla pagina*/}
                    <button className="btn btn-success">Aggiorna quantità</button>
                </form>
               
            </div>
        </div>
    );
}
 
export default UpdateQuantityProduct;
 

