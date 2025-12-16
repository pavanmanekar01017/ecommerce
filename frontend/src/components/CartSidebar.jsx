import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, CheckCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CartSidebar = () => {
    const { isOpen, toggleCart, cart, removeFromCart, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ordering, setOrdering] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            toggleCart();
            navigate('/login');
            return;
        }

        setOrdering(true);
        try {
            await api.post('/orders', { items: cart, total });
            clearCart();
            toggleCart();
            alert('Order placed successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to place order');
        } finally {
            setOrdering(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <ShoppingCart size={48} className="mb-4 opacity-20" />
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        key={item.id}
                                        className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl"
                                    >
                                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                            <div className="text-gray-500 text-sm mt-1">${item.price} x {item.quantity}</div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 size={20} />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="p-8 border-t border-gray-100 bg-white">
                            <div className="flex justify-between text-xl font-bold mb-6 text-gray-800">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || ordering}
                                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex justify-center items-center gap-2"
                            >
                                {ordering ? 'Processing...' : user ? <>Checkout <CheckCircle size={20} /></> : 'Login to Checkout'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartSidebar;
