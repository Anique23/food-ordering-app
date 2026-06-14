import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">🍕 FoodApp</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/menu">Menu</Link>
                {user ? (
                    <>
                        <Link to="/orders">My Orders</Link>
                        {user.is_staff && <Link to="/admin">Admin</Link>}
                        <Link to="/cart" className="cart-link">
                            🛒 Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="register-btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;