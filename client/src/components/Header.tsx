import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-black text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://substackcdn.com/image/fetch/$s_!G1lk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg" alt="iPhone Store" className="w-8 h-8 rounded-md object-cover" />
            <span className="text-xl font-bold">iPhone Store</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-gray-300 transition-colors">Products</Link>
            <Link to="/about" className="hover:text-gray-300 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            {user ? (
              <>
                <span className="text-sm text-gray-200">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="p-2 hover:bg-gray-800 rounded-full transition-colors" aria-label="Account">
                <User className="w-5 h-5" />
              </Link>
            )}
            <Link to="/cart" className="p-2 hover:bg-gray-800 rounded-full transition-colors relative" aria-label="Shopping cart">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-gray-800"
            >
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/products" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Products</Link>
                <Link to="/about" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
                <Link to="/contact" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-800">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </motion.button>
                  {user ? (
                    <>
                      <span className="text-sm text-gray-200">Hi, {user.name}</span>
                      <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Logout"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="p-2 hover:bg-gray-800 rounded-full transition-colors" onClick={() => setIsMenuOpen(false)} aria-label="Account">
                      <User className="w-5 h-5" />
                    </Link>
                  )}
                  <Link to="/cart" className="p-2 hover:bg-gray-800 rounded-full transition-colors relative" onClick={() => setIsMenuOpen(false)} aria-label="Shopping cart">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                      {cartCount}
                    </span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;