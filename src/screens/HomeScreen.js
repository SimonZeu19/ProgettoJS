import React from 'react';
import { Link } from 'react-router-dom';
function HomeScreen() {
  return (
    <div style={{ backgroundImage: "url('url_dell_immagine')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#333', color: '#fff', padding: '30px 50px', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: '0' }}>E-Shop</h2>
        <div>
          
          <Link to="/signin" style={{ color: '#fff', marginRight: '10px' }}>Login</Link>
          <Link to="/register" style={{ color: '#fff' }}>Registrati</Link>
        </div>
      </nav>

      {/* Contenuto */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '50px 20px', textAlign: 'center', flex: 1 }}>
        <h1>Benvenuto su E-Shop!</h1>
        <p>Il tuo negozio online preferito per gli acquisti.</p>
        <p> <Link to="/signin" style={{ textDecoration: 'none', color: 'blue' }}>ACCEDI</Link> oppure <Link to="/register" style={{ textDecoration: 'none', color: 'blue' }}>REGISTRATI</Link> per vedere e acquistare i nostri prodotti.</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <img src="olympics-logo.png" alt="Immagine sinistra" style={{ width: '30%', height: 'auto', marginRight: '20px' }} />
          <img src="pista.png" alt="Product 1" style={{ width: '100%', height: 'auto', marginRight: '20px' }} />
          <img src="olympics-logo.png" alt="Immagine destra" style={{ width: '30%', height: 'auto' }} />
        </div>
      </div>

      <footer style={{ backgroundColor: '#333', color: '#fff', padding: '20px', textAlign: 'center' }}>
  <p>&copy; 2024 ZeuShop. Tutti i diritti riservati.</p>
  <p>Contattaci:</p>
  <p>Email: Carattin.Zeudjio@zeushop.com</p>
  <p>Telefono: +1234567890</p>
  <p>About Us:</p>
  <p>ZeuShop è un negozio online dedicato alla Vendita online attrezzature per atletica leggera per uso professionale e amatoriale. </p>
    <p>Offerta speciale su tutti gli articoli per ogni specialità di atletica leggera: lancio del disco, lancio del peso, lancio del giavellotto, lancio del martello.</p>
   <p>Siamo appassionati di offrire prodotti di alta qualità e un servizio clienti eccellente.</p>
</footer>
    </div>
  );
}


export default HomeScreen;
 
