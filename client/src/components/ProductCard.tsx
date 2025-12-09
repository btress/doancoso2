import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { ShoppingCart, Heart } from 'lucide-react';

    interface ProductCardProps {
      id: string;
      name: string;
      price: number;
      image: string;
      storage: string;
      color: string;
    }

    const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image, storage, color }) => {
      return (
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Link to={`/product/${id}`} className="block">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square bg-gray-50 p-8">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{storage}</span>
                  <span className="text-sm text-gray-600">{color}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-black">${price.toLocaleString()}</span>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.preventDefault()}
                      className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => e.preventDefault()}
                      className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      );
    };

    export default ProductCard;