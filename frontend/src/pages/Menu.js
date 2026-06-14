import React, { useEffect, useState } from 'react';
import { getFoodItems, getCategories } from '../api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './Menu.css';

const Menu = () => {
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selected, setSelected] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        Promise.all([getCategories(), getFoodItems()])
            .then(([catRes, foodRes]) => {
                setCategories(catRes.data);
                setFoods(foodRes.data);
            })
            .catch(() => {
                toast.error('Failed to load menu. Please try again.');
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = foods.filter(f => {
        const matchCat = selected ? f.category === parseInt(selected) : true;
        const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const handleAdd = (food) => {
        addToCart(food);
        toast.success(`${food.name} added to cart! 🛒`);
    };

    if (loading) return (
        <div style={{textAlign:'center', padding:'5rem', fontSize:'1.5rem'}}>
            🍔 Loading Menu...
        </div>
    );

    return (
        <div className="menu-page">
            <h2>🍔 Our Menu</h2>
            <div className="menu-filters">
                <input
                    type="text"
                    placeholder="🔍 Search food..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select value={selected} onChange={e => setSelected(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className="food-grid">
                {filtered.length === 0 ? (
                    <p className="no-food">No food items found</p>
                ) : (
                    filtered.map(food => (
                        <div key={food.id} className="food-card">
                            {food.image ? (
                                <img src={`http://127.0.0.1:8000${food.image}`} alt={food.name} />
                            ) : (
                                <div className="food-placeholder">🍽️</div>
                            )}
                            <div className="food-info">
                                <h3>{food.name}</h3>
                                <p>{food.description}</p>
                                <div className="food-footer">
                                    <span className="price">Rs. {food.price}</span>
                                    <button onClick={() => handleAdd(food)}>Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Menu;