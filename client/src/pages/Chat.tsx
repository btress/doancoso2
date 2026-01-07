import React, { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { messageApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Send } from 'lucide-react';

type Message = {
  _id: string;
  userId: string;
  senderName: string;
  senderEmail: string;
  content: string;
  senderType: 'customer' | 'admin';
  isRead: boolean;
  createdAt: string;
};

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages container only
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const res = await messageApi.list(user.id);
      setMessages((res?.data ?? res ?? []).sort((a: Message, b: Message) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ));
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    if (!user) {
      toast.error('Please login to send message');
      return;
    }

    setLoading(true);
    try {
      await messageApi.send({
        senderName: user.name,
        senderEmail: user.email,
        content: newMessage,
        senderType: 'customer',
        userId: user.id
      });
      setNewMessage('');
      toast.success('Message sent!');
      await fetchMessages();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Chat with Admin</h1>
            <p className="text-gray-600 mb-8">Please login to chat with our admin team</p>
            <a href="/login" className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800">
              Go to Login
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Chat with Admin</h1>

        <div className="bg-gray-50 rounded-lg border border-gray-300 flex flex-col h-96">
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderType === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.senderType === 'customer'
                        ? 'bg-black text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">{msg.senderName}</p>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-300 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
