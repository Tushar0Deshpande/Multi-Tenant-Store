import React, { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
    const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'Staff' });

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) { console.error("Fetch failed", err); }
        };
        fetchInventory();
    }, []);

    // --- NEW DELETE LOGIC ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                // Remove the deleted product from the local state immediately
                setProducts(products.filter(product => product._id !== id));
            } catch (err) {
                alert("Error deleting product. Make sure you have permission.");
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/products', newProduct);
            setProducts([...products, res.data]);
            setNewProduct({ name: '', price: '', stock: '' });
        } catch (err) { alert("Error adding product"); }
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/add-staff', newStaff);
            alert(`New ${newStaff.role} added successfully!`);
            setNewStaff({ name: '', email: '', password: '', role: 'Staff' });
        } catch (err) { alert("Error adding staff member"); }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <nav className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{user?.shopName || "Store"}</h1>
                    <p className="text-sm text-blue-500 font-semibold uppercase">{user?.role} Dashboard</p>
                </div>
                <button onClick={logout} className="bg-red-50 text-red-600 px-4 py-2 rounded-md border border-red-200">Logout</button>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {(user?.role === 'Admin' || user?.role === 'Manager') && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">📦 Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <input type="text" placeholder="Product Name" value={newProduct.name} className="w-full border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} required />
                            <div className="flex gap-4">
                                <input type="number" placeholder="Price" value={newProduct.price} className="w-1/2 border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} required />
                                <input type="number" placeholder="Stock" value={newProduct.stock} className="w-1/2 border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} required />
                            </div>
                            <button className="w-full bg-blue-600 text-white py-2 rounded font-bold">Add to Inventory</button>
                        </form>
                    </div>
                )}

                {user?.role === 'Admin' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">👥 Add Staff Member</h2>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <input type="text" placeholder="Staff Name" value={newStaff.name} className="w-full border p-2 rounded" onChange={(e) => setNewStaff({...newStaff, name: e.target.value})} required />
                            <input type="email" placeholder="Staff Email" value={newStaff.email} className="w-full border p-2 rounded" onChange={(e) => setNewStaff({...newStaff, email: e.target.value})} required />
                            <div className="flex gap-4">
                                <input type="password" placeholder="Password" value={newStaff.password} className="w-1/2 border p-2 rounded" onChange={(e) => setNewStaff({...newStaff, password: e.target.value})} required />
                                <select className="w-1/2 border p-2 rounded" value={newStaff.role} onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}>
                                    <option value="Staff">Staff</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>
                            <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Register Staff</button>
                        </form>
                    </div>
                )}
            </div>

            <h2 className="text-xl font-bold mb-4">Current Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.length > 0 ? products.map(product => (
                    <div key={product._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
                        
                        {/* --- NEW DELETE BUTTON (VISIBLE TO ADMIN/MANAGER ONLY) --- */}
                        {(user?.role === 'Admin' || user?.role === 'Manager') && (
                            <button 
                                onClick={() => handleDelete(product._id)}
                                className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Product"
                            >
                                ✕
                            </button>
                        )}

                        <h3 className="text-lg font-bold text-gray-700">{product.name}</h3>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-gray-500 text-sm font-medium">Stock: {product.stock}</span>
                            <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
                        </div>
                    </div>
                )) : <p className="text-gray-400">No products found. Add some above!</p>}
            </div>
        </div>
    );
};

export default Dashboard;