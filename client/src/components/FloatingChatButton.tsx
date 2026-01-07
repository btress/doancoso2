import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingChatButton() {
  // hide floating button only on admin routes
  if (typeof window !== 'undefined') {
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    if (isAdminRoute) return null;
  }

  return (
    <Link
      to="/chat"
      aria-label="Open chat"
      className="fixed right-4 bottom-6 z-50 rounded-full bg-black text-white w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gray-800 focus:outline-none"
      title="Chat with us"
    >
      <MessageCircle className="w-6 h-6" />
    </Link>
  );
}
