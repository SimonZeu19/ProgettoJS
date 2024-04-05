import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import './Product.css';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';

function Products() {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products/getproducts');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDelete = async (id) => {
    setShowConfirmation(true);
    setProductIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/products/deleteProduct/${productIdToDelete}`);
      setProducts(prevProducts => prevProducts.filter(product => product._id !== productIdToDelete));
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div  style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} >{/** Per evitare che il footer nasconde il contenuto della pagina */}
      <AdminNavbar />
      
      <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
        <div className="w-50 bg-white rounded p-3" style={{ marginBottom: '100px' }}>
          <div className="text-center">
            <button>
              <Link to="/addProduct" className="btn btn-dark text-light">
                Crea Prodotto +
              </Link>
            </button>
          </div>
          {/* Aggiungi la barra di ricerca */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Cerca prodotti..."
            style={{ marginBottom: '20px' }}
          />
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Immagine</th>
                <th>Descrizione</th>
                <th>Prezzo</th>
                <th>Brand</th>
                <th>Quantittà Disponibile</th>
                <th>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td><img src={product.image} alt={product.name} style={{ width: '100px', height: '100px' }} /></td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.brand}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <button>
                      <Link to={`/getProduct/${product._id}`} className="btn btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                  </svg> 
                      </Link>
                    </button>
                    <button>
                      <Link to={`/updateProduct/${product._id}`} className="btn btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                      <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001"/>
                    </svg>
                      </Link>
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="btn btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
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
            <p>Sei sicuro di voler cancellare questo prodotto?</p>
            <button onClick={confirmDelete}>Sì</button>
            <button onClick={() => setShowConfirmation(false)}>No</button>
          </div>
        )}
      </div>
      <AdminFooter/>
    </div>
  );
}

export default Products;