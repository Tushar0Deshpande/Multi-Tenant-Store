import React, { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token, res.data.user || { name: "User", role: "Admin", shopName: res.data.shopName });
            navigate('/dashboard');
        } catch (err) {
            alert("Login Failed: Check your credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-6 text-blue-600 text-center">ShopSaaS</h2>
                <input type="email" placeholder="Email" className="w-full p-3 mb-4 border rounded" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" className="w-full p-3 mb-6 border rounded" onChange={(e) => setPassword(e.target.value)} required />
                <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">Login to Store</button>
            </form>
            <p className="mt-4 text-center text-sm">
    New Store? <a href="/register" className="text-blue-600 font-bold">Register here</a>
</p>
        </div>
    );
};

export default Login;