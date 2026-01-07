import React, { useEffect, useState } from 'react';
import { messageApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function AdminChat() {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem('adminToken');
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }
    fetchMessages();
    const iv = setInterval(fetchMessages, 3000);
    return () => clearInterval(iv);
  }, [adminToken, navigate]);

  // Separate effect for auto-selecting first user on initial load
  useEffect(() => {
    if (!selectedUserId && messages.length > 0) {
      const first = messages.find((m: any) => m.senderType === 'customer' && m.userId);
      if (first && first.userId) setSelectedUserId(first.userId);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await messageApi.list();
      const msgs = (res?.data ?? res ?? []).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      setMessages(msgs);
    } catch (err: any) {
      console.error(err);
    }
  };

  const users = React.useMemo(() => {
    const map = new Map<string, { customer: any; last: any; unread: number }>();
    // First pass: collect customer info and last message
    for (const m of messages) {
      if (!m.userId) continue;
      if (!map.has(m.userId)) {
        map.set(m.userId, { customer: null, last: m, unread: 0 });
      } else {
        const entry = map.get(m.userId)!;
        entry.last = m; // keep the latest message overall
      }
      // Track customer info (senderType === 'customer' has the actual customer details)
      if (m.senderType === 'customer' && !map.get(m.userId)!.customer) {
        map.get(m.userId)!.customer = { name: m.senderName, email: m.senderEmail };
      }
    }
    // Count unread customer messages
    for (const m of messages) {
      if (!m.userId) continue;
      if (m.senderType === 'customer' && !m.isRead) {
        const entry = map.get(m.userId);
        if (entry) entry.unread += 1;
      }
    }
    return Array.from(map.entries()).map(([userId, { customer, last, unread }]) => ({
      userId,
      last,
      customer: customer || { name: last.senderName, email: last.senderEmail },
      unread
    }));
  }, [messages]);

  const conversation = selectedUserId ? messages.filter((m) => m.userId === selectedUserId) : [];

  const markAllReadForUser = async (userId: string) => {
    try {
      const unread = messages.filter((m) => m.userId === userId && m.senderType === 'customer' && !m.isRead);
      await Promise.all(unread.map((m) => messageApi.markAsRead(m._id)));
      await fetchMessages();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    markAllReadForUser(userId);
  };

  const handleSend = async () => {
    if (!selectedUserId) return toast.error('Select a user first');
    if (!reply.trim()) return;
    try {
      await messageApi.send({ senderName: 'Admin', senderEmail: 'admin@store.local', content: reply.trim(), senderType: 'admin', userId: selectedUserId });
      setReply('');
      await fetchMessages();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to send');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await messageApi.delete(id);
      await fetchMessages();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Admin Chat</h1>
          <div className="flex gap-2">
            <a href="/admin-panel" className="px-3 py-1 border rounded">Back</a>
            <button className="px-3 py-1 border rounded" onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin-login'); }}>Logout</button>
          </div>
        </div>

        <div className="bg-white border rounded shadow-sm flex h-[70vh] overflow-hidden">
          {/* Left: users list */}
          <div className="w-80 border-r overflow-auto">
            <div className="p-3 border-b">
              <input placeholder="Search users..." className="w-full px-3 py-2 border rounded" onChange={() => { /* optional search */ }} />
            </div>
            <div>
              {users.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No users have messaged yet.</p>
              ) : (
                users.map((u) => (
                  <button key={u.userId} onClick={() => handleSelectUser(u.userId)} className={`w-full text-left p-3 border-b hover:bg-gray-50 ${selectedUserId === u.userId ? 'bg-gray-100' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{u.customer?.name || 'Customer'}</div>
                        <div className="text-xs text-gray-600">{u.customer?.email}</div>
                      </div>
                      {u.unread > 0 && (
                        <div className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{u.unread}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-700 mt-1 truncate">{u.last?.content}</div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: conversation */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="font-semibold">{conversation.length ? (conversation[0].senderName) : 'Select a user to view conversation'}</div>
              <div className="text-xs text-gray-600">{selectedUserId || ''}</div>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
              {conversation.length === 0 ? (
                <p className="text-center text-gray-500 mt-12">No messages in this conversation.</p>
              ) : (
                conversation.map((m) => (
                  <div key={m._id} className={`max-w-[70%] ${m.senderType === 'admin' ? 'ml-auto text-right' : ''}`}>
                    <div className={`inline-block px-4 py-2 rounded-lg ${m.senderType === 'admin' ? 'bg-black text-white' : 'bg-white border'}`}>
                      <div className="text-sm">{m.content}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="mt-1 text-xs">
                      {m.senderType === 'customer' && !m.isRead && <span className="text-red-600">unread</span>}
                      <button onClick={() => handleDelete(m._id)} className="ml-2 text-red-600 text-xs">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input className="flex-1 border px-3 py-2 rounded" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply..." />
                <button className="bg-black text-white px-4 py-2 rounded" onClick={handleSend}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
