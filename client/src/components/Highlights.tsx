import React from 'react';
import { motion } from 'framer-motion';

export default function Highlights() {
  const highlights = [
    {
      id: 1,
      title: 'Display',
      description: '6.1" Super Retina XDR display with ProMotion technology',
      icon: '📱'
    },
    {
      id: 2,
      title: 'Camera',
      description: 'Pro camera system with 48MP main camera',
      icon: '📷'
    },
    {
      id: 3,
      title: 'Performance',
      description: 'A17 Pro chip for lightning-fast performance',
      icon: '⚡'
    },
    {
      id: 4,
      title: 'Design',
      description: 'Titanium design with Ceramic Shield',
      icon: '✨'
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get the Highlights</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the cutting-edge features that make iPhone 15 Pro the most powerful device we've ever created.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
