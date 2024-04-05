import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavbarUser from './NavbarUser.js';
import FooterUser from './FooterUser.js';

function UserScreen() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const welcomeMessage = new URLSearchParams(location.search).get('welcome');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/getproducts');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/getCartItems/${userId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const activePageStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    margin: '0 5px',
    cursor: 'pointer',
  };
  
  const pageStyle = {
    backgroundColor: '#fff',
    color: '#007bff',
    border: '1px solid #007bff',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    margin: '0 5px',
    cursor: 'pointer',
  };

  const handleAddToCart = async (productId) => {
    try {
      if (!productId) {
        throw new Error('Invalid product ID');
      }

      if (!userId) {
        throw new Error('User ID is not valid');
      }

      const response = await axios.post(`http://localhost:5000/api/cart/addToCart/${userId}`, {
        productId: productId,
      });
    
      console.log('Product added to cart:', response.data);
      alert('Product added to cart successfully!');
      window.location.reload();

    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart. Please try again later.');
    }
  };

  // Filtra tutti i prodotti in base al testo di ricerca
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calcola il numero totale di pagine necessarie per visualizzare i prodotti filtrati
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Calcola gli indici degli oggetti da visualizzare sulla pagina corrente in base alla ricerca
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Componente Product rimane invariato

  const Product = ({ product }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
    };

    return (
      <div key={product._id} style={{ width: '25%', padding: '10px', textAlign: 'center' }}>
        <h3>{product.name}</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isFullScreen ? (
            <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: '9999', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                onClick={toggleFullScreen}
              />
              <button onClick={toggleFullScreen} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '60%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={toggleFullScreen}
            />
          )}
        </div>
        <p>{product.description}</p>
        <h2>Prezzo: €{product.price}</h2>
        <button onClick={() => handleAddToCart(product._id)}>Aggiungi al carrello</button>
      </div>
    );
  };

  return (
    <div>
      <NavbarUser cartItems={cartItems} />
      {welcomeMessage && <div>{welcomeMessage}</div>}
      
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>QUESTI SONO I NOSTRI PRODOTTI</h1>
        <center>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Cerca prodotti..."
            style={{ marginBottom: '20px' }}
          />
        </center>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {currentProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button 
              key={index} 
              onClick={() => handlePageChange(index + 1)} 
              style={currentPage === index + 1 ? activePageStyle : pageStyle}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: '100px' }} />
      </div>
      <FooterUser style={{ position: 'fixed', bottom: '0', width: '100%' }} /> 
    </div>
  );
}

export default UserScreen;

{/**import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import NavbarUser from './NavbarUser.js';
import FooterUser from './FooterUser.js';

function UserScreen() {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [cartItems, setCartItems] = useState([]);

  const [userId, setUserId] = useState(null);
  const welcomeMessage = new URLSearchParams(location.search).get('welcome');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/getproducts');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Recupera l'ID dell'utente dal localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);
   useEffect(() => {
    // Recupera gli elementi nel carrello dal backend
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/getCartItems/${userId}`);
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  useEffect(() => {
    // Quando cambia la pagina, scrollo verso l'inizio della pagina
    window.scrollTo(0, 0);
  }, [currentPage]);

   // Funzione per gestire il cambio di pagina
   const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const activePageStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    margin: '0 5px',
    cursor: 'pointer',
  };
  
  const pageStyle = {
    backgroundColor: '#fff',
    color: '#007bff',
    border: '1px solid #007bff',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    margin: '0 5px',
    cursor: 'pointer',
  };

  // Calcolo degli indici dei prodotti da visualizzare nella pagina corrente
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleAddToCart = async (productId) => {
    try {
      // Verifica se l'ID del prodotto è valido
      if (!productId) {
        throw new Error('Invalid product ID');
      }

      if (!userId) {
        throw new Error('User ID is not valid');
      }

      // Effettua una richiesta al backend per aggiungere il prodotto al carrello con quantità di default 1
      const response = await axios.post(`http://localhost:5000/api/cart/addToCart/${userId}`, {
        productId: productId,
      });
    
    
      console.log('Product added to cart:', response.data);
      // Mostra un messaggio di successo all'utente
      alert('Product added to cart successfully!');
      // Ricarica la pagina per aggiornare il numero di cartItems
      window.location.reload();

    } catch (error) {
      // Gestisci l'errore e fornisci un feedback all'utente
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart. Please try again later.');
    }
  };

  // Filtra i prodotti in base al testo di ricerca
  const filteredProducts = currentProducts.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Componente Product
  const Product = ({ product }) => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
      setIsFullScreen(!isFullScreen);
    };

    return (
      <div key={product._id} style={{ width: '25%', padding: '10px', textAlign: 'center' }}>
        <h3>{product.name}</h3>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isFullScreen ? (
            <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: '9999', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                onClick={toggleFullScreen}
              />
              <button onClick={toggleFullScreen} style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '60%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={toggleFullScreen}
            />
          )}
        </div>
        <p>{product.description}</p>
        <h2>Prezzo: €{product.price}</h2>
        <button onClick={() => handleAddToCart(product._id)}>Aggiungi al carrello</button>
      </div>
    );
  };

  return (
    <div>
      <NavbarUser cartItems={cartItems} />
      {welcomeMessage && <div>{welcomeMessage}</div>}
      
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>QUESTI SONO I NOSTRI PRODOTTI</h1>
        {/* Aggiungi la barra di ricerca 
        <center>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Cerca prodotti..."
            style={{ marginBottom: '20px' }}
          />
        </center>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredProducts.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
        {/* Pulsanti di paginazione 
<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
  {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, index) => (
    <button 
      key={index} 
      onClick={() => handlePageChange(index + 1)} 
      style={currentPage === index + 1 ? activePageStyle : pageStyle}
    >
      {index + 1}
    </button>
  ))}
</div>
       
        <div style={{ marginBottom: '100px' }} />
      </div>
      <FooterUser style={{ position: 'fixed', bottom: '0', width: '100%' }} /> 
    </div>
  );
}

export default UserScreen; */}

























