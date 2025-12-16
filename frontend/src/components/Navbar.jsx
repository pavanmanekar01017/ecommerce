import React from 'react';
import { ShoppingCart, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { cart, toggleCart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-30 backdrop-blur-md bg-white/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        ShopVibe
                    </Link>
                    <div className="flex items-center space-x-6">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="flex items-center gap-1 text-gray-600 hover:text-primary font-medium transition-colors">
                                        <Shield size={18} /> Admin
                                    </Link>
                                )}
                                <Link to="/orders" className="text-gray-600 hover:text-primary font-medium transition-colors">Orders</Link>
                                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-600 hover:text-red-500 font-medium transition-colors">
                                    <LogOut size={18} /> Logout
                                </button>
                                <div className="flex items-center gap-2 text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                                    <UserIcon size={16} />
                                    {user.username}
                                </div>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">Login</Link>
                        )}

                        <button onClick={toggleCart} className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                            <ShoppingCart size={24} />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform bg-secondary rounded-full">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
