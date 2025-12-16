import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                        <Navbar />
                        <CartSidebar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/orders" element={
                                <PrivateRoute>
                                    <Orders />
                                </PrivateRoute>
                            } />
                            <Route path="/admin" element={
                                <PrivateRoute adminOnly={true}>
                                    <Admin />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </div>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
