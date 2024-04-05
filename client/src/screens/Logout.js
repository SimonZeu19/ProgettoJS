const Logout = () => {
  // Rimuovi l'ID dell'utente dal localStorage
  localStorage.removeItem('userId');
  // Effettua il logout nel tuo sistema (pulizia dello stato, reindirizzamento, ecc.)
  // Esempio di pulizia dello stato
  // dispatch(logoutSuccess());
  // Esempio di reindirizzamento
  // history.push('/login');
};

export default Logout;