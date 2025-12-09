import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Award, Shield, Truck, Users } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'We offer only authentic Apple products with full warranty coverage.'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your personal and payment information is protected with industry-leading security.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on all orders with express delivery options available.'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support from our team of Apple-certified specialists.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">About iPhone Store</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your trusted partner for the latest iPhone technology, delivering innovation and excellence since day one.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Founded with a passion for Apple's revolutionary technology, iPhone Store has been serving customers 
                  worldwide with authentic products and exceptional service. We believe that everyone deserves access 
                  to the latest innovations that Apple brings to the world.
                </p>
                <p className="text-gray-600">
                  Our commitment goes beyond just selling products – we're here to help you find the perfect iPhone 
                  that fits your lifestyle and needs. From the latest Pro models to budget-friendly options, we have 
                  something for everyone.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                  alt="Modern store interior"
                  className="rounded-lg shadow-lg"
                  width="600"
                  height="400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-full mb-4">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              To make cutting-edge iPhone technology accessible to everyone while providing an exceptional 
              shopping experience that exceeds expectations. We're not just selling phones – we're connecting 
              people to the future of mobile technology.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}