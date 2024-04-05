{/**import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import {Navigate} from 'react-router-dom';
import AdminDashboard from '../screens/AdminDashboard';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  // Ottieni lo stato di autenticazione dell'utente o altre informazioni necessarie
  // (ad esempio, da Redux o da un hook di contesto)

  const isAuthenticated = true; // Aggiungi la logica per verificare se l'utente è autenticato

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to="/signin" />,
          <Navigate to="/dashboard" />

          
        )
      }
    />
  );
};

export default ProtectedRoute; */}