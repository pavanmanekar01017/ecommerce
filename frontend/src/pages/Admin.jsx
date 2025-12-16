import React, { useEffect, useState } from 'react';
import api from '../api';
import { Trash2, Plus, LayoutDashboard, UserPlus, Users } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [productForm, setProductForm] = useState({ name: '', price: '', description: '', image: '' });
    const [userForm, setUserForm] = useState({ username: '', password: '', role: 'user' });

    const fetchProducts = () => {
        api.get('/products').then(res => setProducts(res.data));
    };

    const fetchUsers = () => {
        api.get('/admin/users').then(res => setUsers(res.data));
    };

    useEffect(() => {
        fetchProducts();
        if (activeTab === 'users') fetchUsers();
    }, [activeTab]);

    const handleDeleteProduct = async (id) => {
        if (confirm('Are you sure?')) {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        await api.post('/admin/products', { ...productForm, price: Number(productForm.price) });
        setProductForm({ name: '', price: '', description: '', image: '' });
        fetchProducts();
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/users', userForm);
            setUserForm({ username: '', password: '', role: 'user' });
            fetchUsers();
            alert('User added successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add user');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
                <LayoutDashboard size={32} className="text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'products' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Products
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Users
                </button>
            </div>

            {activeTab === 'products' ? (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-primary" /> Add New Product
                            </h2>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                    <input value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none h-32 resize-none" required />
                                </div>
                                <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                                    Add Product
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-6">Current Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                                    <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-lg" />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-800">{p.name}</h3>
                                            <p className="text-sm text-gray-500 font-medium">${p.price}</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <UserPlus className="text-primary" /> Add New User
                            </h2>
                            <form onSubmit={handleUserSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                                    Add User
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-6">Users List</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {users.map(u => (
                                <div key={u.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-gray-100 rounded-full text-gray-600">
                                            <Users size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">{u.username}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">ID: {u.id.slice(0, 8)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Admin;
