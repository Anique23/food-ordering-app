import React, { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, getFoodItems, deleteFoodItem, getCategories, addFoodItem } from '../api';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tab, setTab] = useState('orders');
    const [newFood, setNewFood] = useState({ name: '', description: '', price: '', category: '', is_available: true });
    const [foodImage, setFoodImage] = useState(null);

    useEffect(() => {
        getAllOrders().then(res => setOrders(res.data));
        getFoodItems().then(res => setFoods(res.data));
        getCategories().then(res => setCategories(res.data));
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await updateOrderStatus(id, status);
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
            toast.success('Order status updated!');
        } catch { toast.error('Failed to update status'); }
    };

    const handleDeleteFood = async (id) => {
        try {
            await deleteFoodItem(id);
            setFoods(foods.filter(f => f.id !== id));
            toast.success('Food item deleted!');
        } catch { toast.error('Failed to delete'); }
    };

    const handleAddFood = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newFood).forEach(key => formData.append(key, newFood[key]));
        if (foodImage) formData.append('image', foodImage);
        try {
            const res = await addFoodItem(formData);
            setFoods([...foods, res.data]);
            setNewFood({ name: '', description: '', price: '', category: '', is_available: true });
            toast.success('Food item added!');
        } catch { toast.error('Failed to add food item'); }
    };

    // Chart data
    const chartData = [
        { name: 'Pending', value: orders.filter(o => o.status === 'pending').length },
        { name: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length },
        { name: 'Preparing', value: orders.filter(o => o.status === 'preparing').length },
        { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
        { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length },
    ];

    return (
        <div className="admin-page">
            <h2>🛠️ Admin Dashboard</h2>

            {/* Stats */}
            <div className="admin-stats">
                <div className="stat-card">📦 <strong>{orders.length}</strong> Total Orders</div>
                <div className="stat-card">🍔 <strong>{foods.length}</strong> Food Items</div>
                <div className="stat-card">✅ <strong>{orders.filter(o => o.status === 'delivered').length}</strong> Delivered</div>
                <div className="stat-card">⏳ <strong>{orders.filter(o => o.status === 'pending').length}</strong> Pending</div>
            </div>

            {/* Chart */}
            <div className="chart-container">
                <h3>📊 Orders by Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#ff6b35" radius={[5,5,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>📦 Orders</button>
                <button className={tab === 'foods' ? 'active' : ''} onClick={() => setTab('foods')}>🍔 Food Items</button>
                <button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}>➕ Add Food</button>
            </div>

            {/* Orders Tab */}
            {tab === 'orders' && (
                <div className="admin-orders">
                    {orders.map(order => (
                        <div key={order.id} className="admin-order-card">
                            <div><strong>Order #{order.id}</strong> — {order.user_email}</div>
                            <div>Rs. {order.total_price} | 📍 {order.address}</div>
                            <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)}>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="preparing">Preparing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}

            {/* Foods Tab */}
            {tab === 'foods' && (
                <div className="admin-foods">
                    {foods.map(food => (
                        <div key={food.id} className="admin-food-card">
                            <span>{food.name}</span>
                            <span>Rs. {food.price}</span>
                            <button className="delete-btn" onClick={() => handleDeleteFood(food.id)}>🗑️ Delete</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Food Tab */}
            {tab === 'add' && (
                <form className="add-food-form" onSubmit={handleAddFood}>
                    <input placeholder="Food Name" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} required />
                    <textarea placeholder="Description" value={newFood.description} onChange={e => setNewFood({...newFood, description: e.target.value})} required />
                    <input type="number" placeholder="Price" value={newFood.price} onChange={e => setNewFood({...newFood, price: e.target.value})} required />
                    <select value={newFood.category} onChange={e => setNewFood({...newFood, category: e.target.value})} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    <input type="file" accept="image/*" onChange={e => setFoodImage(e.target.files[0])} />
                    <button type="submit">➕ Add Food Item</button>
                </form>
            )}
        </div>
    );
};

export default AdminDashboard;