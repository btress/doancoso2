import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Camera, Cpu, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Cpu,
      title: 'Forged in Titanium',
      description: 'The iPhone 15 Pro uses aerospace-grade titanium, the same alloy used for spacecraft missions to Mars. This makes it incredibly strong yet remarkably light.'
    },
    {
      icon: Camera,
      title: '48MP Pro Camera System',
      description: 'Capture every detail with the advanced Pro camera system. Portrait mode, Night mode, and Cinematic mode deliver professional-grade results.'
    },
    {
      icon: Zap,
      title: 'A17 Pro Chip',
      description: 'The fastest smartphone chip ever. Experience blazing-fast performance with up to 30% improved speed and better battery efficiency.'
    },
    {
      icon: Shield,
      title: 'Ceramic Shield Front',
      description: 'Tougher than any smartphone glass. Ceramic Shield is the hardest and most durable glass ever in a smartphone.'
    }
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore the Full Story</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Every detail is thoughtfully designed to deliver an exceptional experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-black text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
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
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-3">iPhone 15 Pro</h3>
          <p className="text-gray-300 mb-6">
            Titanium. So strong. So light. So Pro.
          </p>
          <a href="/products" className="inline-block bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
