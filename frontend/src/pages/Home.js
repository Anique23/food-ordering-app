import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <div className="hero">
                <h1>🍕 Welcome to FoodApp</h1>
                <p>Order delicious food from the best restaurants</p>
                <Link to="/menu" className="hero-btn">Order Now</Link>
            </div>
            <div className="features">
                <div className="feature-card">🚀 <h3>Fast Delivery</h3><p>Get your food in 30 minutes</p></div>
                <div className="feature-card">🍔 <h3>Best Quality</h3><p>Fresh ingredients always</p></div>
                <div className="feature-card">💰 <h3>Best Prices</h3><p>Affordable meals for everyone</p></div>
            </div>
        </div>
    );
};

export default Home;