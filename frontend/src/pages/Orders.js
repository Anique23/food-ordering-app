import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api';
import { toast } from 'react-toastify';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders()
            .then(res => setOrders(res.data))
            .catch(() => toast.error('Failed to load orders'))
            .finally(() => setLoading(false));
    }, []);

    const statusColor = {
        pending: '#f39c12', confirmed: '#3498db',
        preparing: '#9b59b6', delivered: '#2ecc71', cancelled: '#e74c3c'
    };

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="orders-page">
            <h2>📦 My Orders</h2>
            {orders.length === 0 ? (
                <div className="no-orders">No orders yet! <a href="/menu">Order now</a></div>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-header">
                            <span>Order #{order.id}</span>
                            <span className="order-status" style={{ background: statusColor[order.status] }}>
                                {order.status.toUpperCase()}
                            </span>
                        </div>
                        <div className="order-items">
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <span>{item.food_item_detail?.name}</span>
                                    <span>x{item.quantity}</span>
                                    <span>Rs. {item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className="order-footer">
                            <span>📍 {order.address}</span>
                            <span><strong>Total: Rs. {order.total_price}</strong></span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;