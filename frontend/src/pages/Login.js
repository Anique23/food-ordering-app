import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            toast.error('Please fill all fields');
            return;
        }
        setLoading(true);
        try {
            const res = await loginUser(form);
            login(res.data.user, res.data.access, res.data.refresh);
            toast.success('Login successful!');
            navigate('/menu');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>🔐 Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;