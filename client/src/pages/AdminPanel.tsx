import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productApi, orderApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'stats'>('products');
  const [form, setForm] = useState<any>({
    name: '', price: 0, image: '', storage: '', color: '', description: '',
    category: 'iphone-15-series', modelType: 'standard', stock: 0, discount: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await productApi.list();
        setProducts(res?.data ?? res ?? []);
      } catch (err: any) {
        toast.error(err?.message || 'Không thể tải sản phẩm');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await orderApi.list();
        setOrders(res?.data ?? res ?? []);
      } catch (err: any) {
        toast.error(err?.message || 'Không thể tải đơn hàng');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await orderApi.stats();
        setStats(res?.data ?? res);
      } catch (err: any) {
        console.error('Failed to load stats:', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!adminToken) navigate('/admin-login');
  }, [adminToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) { toast.error('Vui lòng đăng nhập admin'); return; }
    setLoading(true);
    const allowedStorages = ['64GB', '128GB', '256GB', '512GB', '1TB'];
    if (!form.name || !form.price || !form.image || !allowedStorages.includes(form.storage) || !form.color || !form.description) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }
    try {
      if (editingId) {
        await productApi.update(adminToken, editingId, form);
        toast.success('Cập nhật thành công');
      } else {
        await productApi.create(adminToken, form);
        toast.success('Thêm sản phẩm thành công');
      }
      const res = await productApi.list();
      setProducts(res?.data ?? res ?? []);
      setForm({ name: '', price: 0, image: '', storage: '', color: '', description: '', category: 'iphone-15-series', modelType: 'standard', stock: 0, discount: 0 });
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.message || 'Lưu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);
    setForm({ name: p.name || '', price: p.price || 0, image: p.image || '', storage: p.storage || '', color: p.color || '', description: p.description || '', category: p.category || 'iphone-15-series', modelType: p.modelType || 'standard', stock: p.stock || 0, discount: p.discount || 0 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!adminToken) { toast.error('Vui lòng đăng nhập admin'); return; }
    if (!window.confirm('Xác nhận xóa?')) return;
    try {
      await productApi.remove(adminToken, id);
      toast.success('Đã xóa');
      const res = await productApi.list();
      setProducts(res?.data ?? res ?? []);
    } catch (err: any) {
      toast.error(err?.message || 'Xóa thất bại');
    }
  };

  // Calculate max values for charts
  const maxDailyRevenue = stats?.last7Days?.reduce((max: number, d: any) => Math.max(max, d.revenue), 0) || 1;
  const maxMonthlyRevenue = stats?.last6Months?.reduce((max: number, d: any) => Math.max(max, d.revenue), 0) || 1;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4 items-center space-x-2">
          <a href="/admin-chat" className="px-3 py-1 bg-black text-white rounded">Open Chat</a>
          <button className="px-3 py-1 border rounded" onClick={() => { localStorage.removeItem('adminToken'); setAdminToken(null); navigate('/admin-login'); }}>Logout</button>
        </div>
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-black text-white' : 'border border-gray-300'}`}>Sản phẩm</button>
          <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-black text-white' : 'border border-gray-300'}`}>Đơn hàng</button>
          <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded ${activeTab === 'stats' ? 'bg-black text-white' : 'border border-gray-300'}`}>Thống kê</button>
        </div>

        {activeTab === 'products' && (
        <>
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-xl font-semibold mb-3">{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border px-3 py-2 rounded" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input type="number" className="border px-3 py-2 rounded" placeholder="Giá (USD)" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              <input className="border px-3 py-2 rounded" placeholder="Link ảnh" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <input className="border px-3 py-2 rounded" placeholder="Dung lượng (128GB...)" value={form.storage} onChange={(e) => setForm({ ...form, storage: e.target.value })} />
              <input className="border px-3 py-2 rounded" placeholder="Màu sắc" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              <textarea className="border px-3 py-2 rounded md:col-span-2" placeholder="Mô tả" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" disabled={loading} className="bg-black text-white px-4 py-2 rounded">{loading ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm')}</button>
                <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', price: 0, image: '', storage: '', color: '', description: '', category: 'iphone-15-series', modelType: 'standard', stock: 0, discount: 0 }); }} className="border px-4 py-2 rounded">Làm mới</button>
              </div>
            </form>
          </section>
          <section className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-3">Danh sách ({products.length})</h3>
            <div className="overflow-auto max-h-64">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-2 py-1 text-left">Tên</th><th className="px-2 py-1 text-left">Giá</th><th className="px-2 py-1 text-left">Actions</th></tr></thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-t">
                      <td className="px-2 py-1">{p.name}</td>
                      <td className="px-2 py-1">${(p.discountPrice || p.price)?.toLocaleString()}</td>
                      <td className="px-2 py-1 space-x-2">
                        <button className="text-blue-600 hover:underline" onClick={() => handleEdit(p)}>Sửa</button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(p._id)}>Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
        )}

        {activeTab === 'orders' && (
          <section className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-4">Danh sách đơn hàng ({orders.length})</h3>
            <div className="overflow-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border px-3 py-2 text-left">ID</th>
                    <th className="border px-3 py-2 text-left">Khách hàng</th>
                    <th className="border px-3 py-2 text-left">Sản phẩm</th>
                    <th className="border px-3 py-2 text-left">Tổng tiền</th>
                    <th className="border px-3 py-2 text-left">Trạng thái</th>
                    <th className="border px-3 py-2 text-left">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t hover:bg-gray-50">
                      <td className="border px-3 py-2 font-semibold">{order.orderId}</td>
                      <td className="border px-3 py-2">{order.customer?.name}</td>
                      <td className="border px-3 py-2 text-xs">{order.items?.map((i: any) => i.name).join(', ')}</td>
                      <td className="border px-3 py-2 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                      <td className="border px-3 py-2"><span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered' ? 'bg-green-100' : 'bg-yellow-100'}`}>{order.status}</span></td>
                      <td className="border px-3 py-2 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border text-center">
              <p className="text-sm text-gray-500">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-green-600">${stats.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border text-center">
              <p className="text-sm text-gray-500">Hôm nay</p>
              <p className="text-2xl font-bold text-blue-600">${stats.todayRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border text-center">
              <p className="text-sm text-gray-500">Tổng đơn</p>
              <p className="text-2xl font-bold">{stats.totalOrders || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border text-center">
              <p className="text-sm text-gray-500">Chờ xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border text-center">
              <p className="text-sm text-gray-500">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedOrders || 0}</p>
            </div>
          </div>

          {/* Daily Revenue Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Doanh thu 7 ngày gần đây</h3>
            <div className="space-y-2">
              {stats.last7Days?.map((day: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-16 text-sm text-gray-600">{day.date}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div className="bg-green-500 h-6 rounded-full absolute left-0 top-0" style={{ width: `${(day.revenue / maxDailyRevenue) * 100}%` }} />
                  </div>
                  <span className="w-24 text-sm text-right font-semibold">${day.revenue?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Doanh thu 6 tháng gần đây</h3>
            <div className="space-y-2">
              {stats.last6Months?.map((month: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-32 text-sm text-gray-600">{month.month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div className="bg-blue-500 h-6 rounded-full absolute left-0 top-0" style={{ width: `${(month.revenue / maxMonthlyRevenue) * 100}%` }} />
                  </div>
                  <span className="w-24 text-sm text-right font-semibold">${month.revenue?.toLocaleString() || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-semibold mb-4">Top sản phẩm bán chạy</h3>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">Sản phẩm</th><th className="px-3 py-2 text-left">Số lượng</th><th className="px-3 py-2 text-left">Doanh thu</th></tr></thead>
              <tbody>
                {stats.topProducts?.map((p: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">{p.quantity}</td>
                    <td className="px-3 py-2 font-semibold">${p.revenue?.toLocaleString() || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
