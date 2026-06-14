import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
    const { user } = useAuth();
    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOrder = async () => {
        if (!address) { toast.error('Please enter delivery address'); return; }
        if (cartItems.length === 0) { toast.error('Cart is empty'); return; }
        setLoading(true);
        try {
            await placeOrder({
                address,
                items: cartItems.map(item => ({ food_id: item.id, quantity: item.quantity }))
            });
            clearCart();
            toast.success('Order placed successfully! 🎉');
            navigate('/orders');
        } catch (err) {
            toast.error('Failed to place order');
        }
        setLoading(false);
    };

    if (cartItems.length === 0) return (
        <div className="empty-cart">
            <h2>🛒 Your cart is empty</h2>
            <a href="/menu">Browse Menu</a>
        </div>
    );

    return (
        <div className="cart-page">
            <h2>🛒 Your Cart</h2>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <span className="item-name">{item.name}</span>
                        <div className="item-controls">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <span className="item-price">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <textarea placeholder="Enter delivery address..." value={address} onChange={e => setAddress(e.target.value)} rows={3} />
                <div className="total">Total: <strong>Rs. {totalPrice.toFixed(2)}</strong></div>
                <button className="order-btn" onClick={handleOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : '✅ Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Cart;