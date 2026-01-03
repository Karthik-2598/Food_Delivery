import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';
import Login from './components/Login';
import Register from './components/Register';
import CustomerDashboard from './components/CustomerDashboard';
import AdminDashboard from './components/AdminDashboard';
import OrderConfirmation from './components/OrderConfirmation';
import { AppContext } from './context/AppContext';
import axios from 'axios';
import { LoadScript } from '@react-google-maps/api';
import 'leaflet/dist/leaflet.css';

axios.defaults.baseURL = 'https://food-delivery-backend-5ixm.onrender.com/api';
axios.defaults.withCredentials = true;


const libraries=['places'];

function App() {
  const [user, setUser] = useState(null); // { token, role, username }
  const [cart, setCart] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [socket, setSocket] = useState(null);


  const addToCart = (item) => {
    setCart((prevCart)=>{
      const existingItem = prevCart.find((cartItem)=> cartItem.foodId._id === item._id);
      if(existingItem){
        return prevCart.map((cartItem)=> cartItem.foodId._id === item._id ? {...cartItem, quantity: cartItem.quantity  + 1}: cartItem);
      }
      return [...prevCart, {foodId: item, quantity: 1}];
    });
  };

  const clearCart = ()=>{
    setCart([]);
  };
  const setOrderConfirmation = (order) =>{
    setOrderData(order);
  }
    useEffect(()=>{
    const token = localStorage.getItem('token');
    if(token){
      axios.get('/auth/verify', {withCredentials: true})
      .then(res => {
        console.log('Token verification:', res.data);
        setUser({id: res.data.id, username: res.data.username, role: res.data.role})
        .catch(err=> {
          console.error('Token verification failed:', err);
          localStorage.removeItem('token');
        })
      })
    }
  }, []);
  useEffect(()=>{// initialize socket session on user login
    if(user?.id){
      const newSocket = io('https://food-delivery-backend-5ixm.onrender.com/api', {
        auth: {token: user.token},
      });
      newSocket.on('connect', ()=>{
        console.log('Socket connected:', newSocket.id);
        
        newSocket.emit('joinUserRoom', user.id);
      });
      newSocket.on('connect_error', (err)=>{
        console.error('Socket connection error:', err.message);
      })
      setSocket(newSocket);
      return()=> newSocket.disconnect();
    }
  }, [user]);

  const logout = async()=>{
    try{
      await axios.post('/auth/logout', {}, {withCredentials: true});
    }catch(err){
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <LoadScript
            googleMapsApiKey="AIzaSyBLmNj3GWDIrMGsRNWPODsBvBfRnnA4ldY"
            libraries={libraries}
            id="google-maps-script"
            onLoad={()=> {console.log("Google maps loaded ");
              setGoogleLoaded(true);
            }}
            onError={(err)=> {console.error('Google maps load error: ', err);
              setGoogleLoaded(false);
            }}
    >
    <AppContext.Provider value={{ user, setUser, cart, setCart, addToCart , clearCart, setOrderConfirmation, googleLoaded, socket, logout}}>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path ="/register" element={<Register />} />
          <Route 
            path="/customer" 
            element={user?.role === 'customer' ? <CustomerDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
          <Route path="/order-confirmation" element={<OrderConfirmation orderData = {orderData}/>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </AppContext.Provider>
    </LoadScript>
  );
}

export default App;