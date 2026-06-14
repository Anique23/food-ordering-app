import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api';
import { toast } from 'react-toastify';
import './Auth.css';

const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyEmail({ email, code });
            toast.success('Email verified! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error('Invalid verification code');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>📧 Verify Email</h2>
                <p style={{textAlign:'center', color:'#666'}}>Enter the 6-digit code sent to {email}</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Enter 6-digit code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} required />
                    <button type="submit">Verify</button>
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;