import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Your order has been placed successfully. We'll process it soon and send you updates via email.
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-gray-700">
              Our team will review your order and contact you if we need any additional information.
            </p>
            <p className="text-gray-700 mt-2">
              Thank you for shopping with us!
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
            <p className="text-sm text-gray-600">
              You can track your order from your account or check your email for updates.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
