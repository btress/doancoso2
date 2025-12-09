import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import Products from './src/pages/Products';
import ProductDetail from './src/pages/ProductDetail';
import About from './src/pages/About';
import Contact from './src/pages/Contact';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Cart from './src/pages/Cart';
import NotFound from './src/pages/NotFound';
import AdminPanel from './src/pages/AdminPanel';
import AdminLogin from './src/pages/AdminLogin';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <AuthProvider>
        <CartProvider>
          <Router>
            <main className="min-h-screen font-inter">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin-panel" element={<AdminPanel />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
              />
            </main>
          </Router>
        </CartProvider>
      </AuthProvider>
    </Theme>
  );
}

export default App;