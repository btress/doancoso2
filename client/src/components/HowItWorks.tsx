import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: ShoppingCart,
      title: 'Browse & Shop',
      description: 'Explore our collection of iPhone models and choose the one that fits your needs perfectly.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your iPhone delivered within 2-3 business days with secure packaging.'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy - if you\'re not satisfied, we\'ll handle the rest.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our expert support team is always ready to help with any questions.'
    }
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Shopping with us is simple, secure, and worry-free.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-black to-transparent"></div>
                )}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg p-6 relative z-10 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-black text-white mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>

                {/* Step number */}
                <div className="absolute -top-3 right-0 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Ready to upgrade your iPhone?
          </p>
          <a href="/products" className="inline-block bg-black text-white px-8 py-3 rounded font-semibold hover:bg-gray-800 transition-colors">
            Start Shopping
          </a>
        </motion.div>
      </div>
    </section>
  );
}
