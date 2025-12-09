import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { productApi } from '../services/api';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const itemWidth = 100 / itemsPerView; // 25% for 4 items

  useEffect(() => {
    productApi.featured()
      .then((res) => setFeaturedProducts(res.data))
      .catch(() => setFeaturedProducts([]));
  }, []);

  const maxIndex = Math.max(0, featuredProducts.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular iPhone models with the latest features and technology
          </p>
        </motion.div>
        
        <div className="relative group">
          {/* Carousel Wrapper */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: -currentIndex * (itemWidth + 1.5) + '%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${itemWidth}% - ${(6 * (itemsPerView - 1)) / itemsPerView}px)` }}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={product.discountPrice || product.price}
                    image={product.image}
                    storage={product.storage}
                    color={product.color}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {featuredProducts.length > itemsPerView && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed lg:group-hover:visible invisible"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed lg:group-hover:visible invisible"
                aria-label="Next products"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}
        </div>

        {/* Indicators */}
        {featuredProducts.length > itemsPerView && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: featuredProducts.length - itemsPerView + 1 }).map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;