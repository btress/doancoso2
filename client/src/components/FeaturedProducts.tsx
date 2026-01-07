import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { productApi } from '../services/api';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 4;
  const itemWidth = 100 / itemsPerView; // 25% for 4 items

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // gap in pixels matching Tailwind `gap-4` (1rem -> 16px)
  const gapPx = 16;

  useEffect(() => {
    const update = () => setContainerWidth(containerRef.current?.clientWidth || 0);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    productApi.featured()
      .then((res) => setFeaturedProducts(res.data))
      .catch(() => setFeaturedProducts([]));
  }, []);

  const maxIndex = Math.max(0, featuredProducts.length - itemsPerView);

  // No autoplay: user will navigate using arrows only to avoid partial slides


  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our most popular iPhone models with the latest features and technology
          </p>
        </motion.div>

        <div className="relative group">
          {/* Carousel Wrapper */}
          <div className="overflow-hidden" ref={containerRef}>
            <motion.div
              className="flex gap-4"
              animate={{
                x: containerWidth
                  ? -currentIndex * ((containerWidth - gapPx * (itemsPerView - 1)) / itemsPerView + gapPx)
                  : `-${currentIndex * (itemWidth + 1.5)}%`
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {featuredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="flex-shrink-0"
                  whileHover={{ y: -6, scale: 1.01 }}
                  style={{
                    width: containerWidth
                      ? `${containerWidth / itemsPerView - ((gapPx * (itemsPerView - 1)) / itemsPerView)}px`
                      : `calc(${itemWidth}% - ${((gapPx * (itemsPerView - 1)) / itemsPerView)}px)`
                  }}
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
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black p-2.5 sm:p-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>

              <motion.button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white text-black p-2.5 sm:p-3 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next products"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
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
                onClick={() => setCurrentIndex(index)}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: index === currentIndex ? 1.06 : 1.18 }}
                animate={index === currentIndex ? { scale: [1, 1.12, 1] } : undefined}
                transition={index === currentIndex ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.15 }}
                className={`${index === currentIndex ? 'w-4 h-4 rounded-full bg-white ring-1 ring-gray-300 shadow-lg transition-all' : 'w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400 transition-all shadow-sm'}`}
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