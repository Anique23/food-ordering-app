import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <Router>
            <Navbar />
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={
                    <PrivateRoute><Cart /></PrivateRoute>
                } />
                <Route path="/orders" element={
                    <PrivateRoute><Orders /></PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute><AdminDashboard /></PrivateRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;