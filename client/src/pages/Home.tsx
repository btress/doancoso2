import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Technology from '../components/Technology';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Technology />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
}