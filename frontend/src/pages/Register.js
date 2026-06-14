import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirm_password: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm_password) {
            toast.error('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            await registerUser(form);
            toast.success('Registered! Please verify your email.');
            navigate('/verify-email', { state: { email: form.email } });
        } catch (err) {
            const errors = err.response?.data;
            if (errors) {
                Object.values(errors).forEach(msg => toast.error(msg[0]));
            } else {
                toast.error('Registration failed');
            }
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>📝 Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
                    <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
                    <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                    <input type="password" name="confirm_password" placeholder="Confirm Password" value={form.confirm_password} onChange={handleChange} required />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;