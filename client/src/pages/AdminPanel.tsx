import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

// A lightweight, standalone admin panel that is not tied to the main site layout.
// This page intentionally omits Header/Footer so it can be opened independently (e.g. /admin-panel).

export default function AdminPanel() {
  // AdminPanel expects admin token to be present (from separate login page)
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    name: '',
    price: 0,
    image: '',
    storage: '',
    color: '',
    description: '',
    category: 'iphone-15-series',
    modelType: 'standard',
    stock: 0,
    discount: 0,
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
    // if no admin token, redirect to admin login page
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [adminToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) {
      toast.error('Vui lòng đăng nhập admin để thao tác');
      return;
    }
    setLoading(true);
    // Client-side validation to avoid server 400 from missing/invalid fields
    const urlRegex = /^https?:\/\//i;
    const allowedStorages = ['64GB', '128GB', '256GB', '512GB', '1TB'];
    if (!form.name) { toast.error('Tên sản phẩm bắt buộc'); setLoading(false); return; }
    if (!form.price || Number(form.price) < 0) { toast.error('Giá phải là số >= 0'); setLoading(false); return; }
    if (!form.image || !urlRegex.test(form.image)) { toast.error('Vui lòng nhập URL hình ảnh hợp lệ (http(s)://...)'); setLoading(false); return; }
    if (!allowedStorages.includes(form.storage)) { toast.error('Storage phải là một trong: ' + allowedStorages.join(', ')); setLoading(false); return; }
    if (!form.color) { toast.error('Color bắt buộc'); setLoading(false); return; }
    if (!form.description) { toast.error('Description bắt buộc'); setLoading(false); return; }
    if (form.discount && (form.discount < 0 || form.discount > 100)) { toast.error('Discount phải nằm trong 0-100'); setLoading(false); return; }
    try {
      if (editingId) {
        await productApi.update(adminToken, editingId, form);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await productApi.create(adminToken, form);
        toast.success('Thêm sản phẩm thành công');
      }
      const res = await productApi.list();
      setProducts(res?.data ?? res ?? []);
      setForm({
        name: '', price: 0, image: '', storage: '', color: '', description: '',
        category: 'iphone-15-series', modelType: 'standard', stock: 0, discount: 0
      });
      setEditingId(null);
    } catch (err: any) {
      toast.error(err?.message || 'Lưu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      price: p.price || 0,
      image: p.image || '',
      storage: p.storage || '',
      color: p.color || '',
      description: p.description || '',
      category: p.category || 'iphone-15-series',
      modelType: p.modelType || 'standard',
      stock: p.stock || 0,
      discount: p.discount || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!adminToken) { toast.error('Vui lòng đăng nhập admin để thao tác'); return; }
    if (!window.confirm('Xác nhận xóa sản phẩm này?')) return;
    try {
      await productApi.remove(adminToken, id);
      toast.success('Đã xóa sản phẩm');
      const res = await productApi.list();
      setProducts(res?.data ?? res ?? []);
      // if we deleted the product being edited, reset form
      if (editingId === id) {
        setEditingId(null);
        setForm({ name: '', price: 0, image: '', storage: '', color: '', description: '', category: 'iphone-15-series', modelType: 'standard', stock: 0, discount: 0 });
      }
    } catch (err: any) {
      toast.error(err?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4">
          <button className="px-3 py-1 border rounded" onClick={() => { localStorage.removeItem('adminToken'); setAdminToken(null); navigate('/admin-login'); }}>Logout admin</button>
        </div>
        <h1 className="text-3xl font-bold mb-4">Admin Panel (Standalone)</h1>
        <p className="text-sm text-gray-600 mb-6">Trang quản trị tách biệt — không dùng Header/Footer của trang chính.</p>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold mb-3">Thêm sản phẩm</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            // inject admin token into requests via productApi calls by passing adminToken
            await handleSubmit(e as any);
          }} className="grid grid-cols-1 gap-3">
            <label className="flex flex-col">
              <span className="font-medium">Tên sản phẩm</span>
              <input
                className="border border-gray-300 rounded px-3 py-2 mt-1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <span className="text-xs text-gray-500 mt-1">Ghi chú: Điền tên đầy đủ, ví dụ "iPhone 15 Pro 128GB"</span>
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Giá (USD)</span>
              <input
                type="number"
                className="border border-gray-300 rounded px-3 py-2 mt-1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                required
              />
              <span className="text-xs text-gray-500 mt-1">Ghi chú: Giá nguyên (không tính giảm giá). Ví dụ: 999.99</span>
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Link ảnh</span>
              <input
                className="border border-gray-300 rounded px-3 py-2 mt-1"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                required
              />
              <span className="text-xs text-gray-500 mt-1">Ghi chú: URL trực tiếp tới ảnh (https://...), hoặc dùng đường dẫn relative với public/</span>
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Dung lượng</span>
              <input
                className="border border-gray-300 rounded px-3 py-2 mt-1"
                value={form.storage}
                onChange={(e) => setForm({ ...form, storage: e.target.value })}
                placeholder="VD: 128GB"
                required
              />
              <span className="text-xs text-gray-500 mt-1">Ghi chú: Viết kèm đơn vị, ví dụ 128GB, 256GB</span>
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Màu sắc</span>
              <input
                className="border border-gray-300 rounded px-3 py-2 mt-1"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                required
              />
              <span className="text-xs text-gray-500 mt-1">Ghi chú: Ghi theo tên màu (ví dụ: Black, White, Starlight)</span>
            </label>

            <label className="flex flex-col">
              <span className="font-medium">Mô tả</span>
              <textarea
                rows={3}
                className="border border-gray-300 rounded px-3 py-2 mt-1"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
              <span className="text-xs text-gray-500 mt-1">Ghi chú: Viết mô tả ngắn (2-3 câu) nêu điểm nổi bật</span>
            </label>

            <div className="flex space-x-2">
              <button type="submit" disabled={loading || !adminToken} className="bg-black text-white px-4 py-2 rounded">
                {loading ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm sản phẩm')}
              </button>
              <button type="button" onClick={() => setForm({ name: '', price: 0, image: '', storage: '', color: '', description: '', category: 'iphone-15-series', modelType: 'standard', stock: 0, discount: 0 })} className="px-4 py-2 border rounded">
                Làm mới
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white p-4 rounded border">
          <h3 className="font-semibold mb-3">Danh sách sản phẩm</h3>
          <div className="overflow-auto max-h-64">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-1 text-left">Tên</th>
                  <th className="px-2 py-1 text-left">Giá</th>
                  <th className="px-2 py-1 text-left">Tồn</th>
                  <th className="px-2 py-1 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-2 py-1">{p.name}</td>
                    <td className="px-2 py-1">${(p.discountPrice || p.price)?.toLocaleString()}</td>
                    <td className="px-2 py-1">{p.stock}</td>
                    <td className="px-2 py-1 flex space-x-2">
                      <button className="text-blue-600 hover:underline" onClick={() => handleEdit(p)}>Sửa</button>
                      <button className="text-red-600 hover:underline" onClick={() => handleDelete(p._id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-xs text-gray-500 mt-6">Ghi chú: Trang này là một admin panel độc lập. Nếu muốn tích hợp sâu hơn (xác thực, phân quyền), tôi có thể thêm chức năng xác thực và layout admin riêng.</p>
      </div>
    </div>
  );
}

// Small admin login component used inside AdminPanel
function AdminLogin({ onLogin }: { onLogin: (u: string, p: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); onLogin(username, password); }} className="grid grid-cols-1 gap-2 max-w-sm">
      <input className="border px-3 py-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input className="border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div>
        <button className="bg-black text-white px-3 py-2 rounded" type="submit">Login</button>
      </div>
    </form>
  );
}
