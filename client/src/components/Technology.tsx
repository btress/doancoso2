import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Camera, Zap, Shield, Wifi, Lock } from 'lucide-react';

const Technology = () => {
  const technologies = [
    {
      icon: Cpu,
      title: 'A17 Pro Chip',
      description: 'Hiệu năng đỉnh cao với công nghệ 3nm, tăng tốc độ xử lý 10% và tiết kiệm pin 20%.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Camera,
      title: '48MP Camera',
      description: 'Hệ thống camera tiên tiến với quay video 4K ProRes chuyên nghiệp và Night mode cải tiến.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Thời lượng pin',
      description: 'Từ 20 đến 30 giờ xem video, với sạc nhanh 45W và sạc không dây MagSafe.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Ceramic Shield',
      description: 'Kính Ceramic Shield tougher 4x, bảo vệ tốt hơn trước va đập và trầy xước.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Wifi,
      title: '5G Speed',
      description: 'Kết nối 5G cực nhanh cho streaming và tải về mà không có độ trễ.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Lock,
      title: 'Bảo mật cao',
      description: 'Face ID tiên tiến và mã hóa end-to-end cho tất cả dữ liệu cá nhân.',
      color: 'from-red-500 to-rose-500'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Công nghệ iPhone
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những tính năng tiên tiến nhất được tích hợp vào iPhone, mang lại trải nghiệm vượt trội.
          </p>
        </motion.div>

        {/* Technology Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                className="bg-gray-100 rounded-xl p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-gray-400 overflow-hidden"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-black mb-6 shadow-lg`}> 
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{tech.title}</h3>
                <p className="text-gray-700 leading-relaxed">{tech.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Trải nghiệm công nghệ tiên tiến cùng iPhone 15 Pro
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300"
          >
            Khám phá sản phẩm
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;
