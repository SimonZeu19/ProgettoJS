import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SigninScreen from './screens/SigninScreen.js';
import RegisterScreen from './screens/RegisterScreen.js';
import './index.css'
import HomeScreen from './screens/HomeScreen.js';
import AdminDashboard from './screens/AdminDashboard.js';
import UserScreen from './screens/UserScreen.js';
import DeleteUser from './screens/DeleteUser.js';
import GetUser from './screens/GetUser.js';
import GetAllUsers from './screens/GetAllUsers.js';
import UpdateUser from './screens/UpdateUser.js';
import CreateAdmin from './screens/CreateAdmin.js';
import AddUser from './screens/AddUser.js';

import DeleteProduct from './screens/DeleteProduct.js';
import GetProduct from './screens/GetProduct.js';
import GetAllProducts from './screens/GetAllProducts.js';
import UpdateProduct from './screens/UpdateProduct.js';

import AddProduct from './screens/AddProduct.js';

import Logout from './screens/Logout.js';
import Navbar from './screens/Navbar.js';
import CartScreen from './screens/CartScren.js';
import AddToCart from './screens/AddToCart.js';
import RemoveFromCart from './screens/RemovefromCart.js';
import UpdateQuantityProduct from './screens/UpdateQuantityProduct.js';
//import Layout from './screens/Layout.js';
import ProtectedRoute from './screens/ProtectedRoute.js';
import NavbarUser from './screens/NavbarUser.js';
import OrdersDetails from './screens/GetOrders.js';
import AdminOrdersList from './screens/AdminOrders.js';
import UserProfile from './screens/UserProfile.js';



function App() {
  return (
    <div className="App">
      
      <Router>
    
        <Routes>
          
          <Route path="/" element={<HomeScreen />} />
          <Route path="/signin" element={<SigninScreen />} />  
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/users/:id" element={<UserScreen/>} />
          <Route path="/orders/:userId" element={<OrdersDetails/>} />
          <Route path="/updateProfile/:userId" element={<UserProfile/>} />



         
         {/**CRUD per gli utenti */}
         <Route path="/createAdmin" element={<CreateAdmin />} />
         <Route path="/deleteUser/:id" element={<DeleteUser />} />
         <Route path="/updateUser/:id" element={<UpdateUser />} />
         <Route path="/getone/:id" element={<GetUser />} />
         <Route path="/getusers" element={<GetAllUsers />} />
         <Route path="/createuser" element={<AddUser />} />
         <Route path="/admin/orders/:userId" element={<AdminOrdersList/>} />
      

         {/**CRUD per i prodotti */}
         <Route path="/deleteProduct/:id" element={<DeleteProduct />} />
         <Route path="/updateProduct/:id" element={<UpdateProduct />} />
         <Route path="/getProduct/:id" element={<GetProduct />} />
         <Route path="/getProducts" element={<GetAllProducts />} />
         <Route path="/addProduct" element={<AddProduct />} />

        
         {/** CRUD per elementi del carello*/}
          <Route path="/getCartItems/:userId" element={<CartScreen />} />
         {/** <ProtectedRoute path="/getCartItems/:userId" component={CartScreen} />*/}
         <Route path="/addToCart/:userId" element={<AddToCart />} />
         <Route path="/removeFromCart/:userId/:productId" element={<RemoveFromCart />} />
         <Route path="/updateQuantity/:userId/:productId" element={<UpdateQuantityProduct />} />
        
         




        

        </Routes>
      
      </Router>
    </div>
  );
}

export default App;
































