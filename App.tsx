
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import Emergency from './pages/Emergency';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import StoreLogin from './pages/StoreLogin';
import StorePanel from './pages/StorePanel';

// Protected Admin Route
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

// Protected Store Route
const ProtectedStoreRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isStore, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !isStore) return <Navigate to="/store" replace />;
  return <>{children}</>;
};

const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/*" element={
        <ProtectedAdminRoute>
          <AdminPanel />
        </ProtectedAdminRoute>
      } />

      {/* Store Routes */}
      <Route path="/store" element={<StoreLogin />} />
      <Route path="/store/*" element={
        <ProtectedStoreRoute>
          <StorePanel />
        </ProtectedStoreRoute>
      } />

      {/* Standalone Pages (No Layout) */}
      <Route path="/login" element={<Login />} />

      {/* Pages with Main Layout */}
      <Route path="*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={
              <ProtectedUserRoute>
                <Dashboard />
              </ProtectedUserRoute>
            } />
            <Route path="/emergency" element={<Emergency />} />
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <Router>
            <AppRoutes />
          </Router>
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
