import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ shopName: '', name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert("Shop Registered! Now Login.");
            navigate('/login');
        } catch (err) {
            alert("Registration failed. Try a different email.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Start Your ShopSaaS</h2>
                <input type="text" placeholder="Shop Name (e.g. Ramesh Kirana)" className="w-full p-3 mb-4 border rounded" 
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})} required />
                <input type="text" placeholder="Your Name" className="w-full p-3 mb-4 border rounded" 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Admin Email" className="w-full p-3 mb-4 border rounded" 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" className="w-full p-3 mb-6 border rounded" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 transition">Create Store</button>
                <p className="mt-4 text-center text-sm">
    Already have a store? <a href="/login" className="text-green-600 font-bold">Login here</a>
</p>
            </form>
        </div>
    );
};

export default Register;