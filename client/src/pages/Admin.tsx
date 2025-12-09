import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import { productApi, orderApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

type ProductForm = {
  _id?: string;
  name: string;
  price: number;
  image: string;
  storage: string;
  color: string;
  description: string;
  category: string;
  modelType: string;
  stock: number;
  discount?: number;
};

const emptyForm: ProductForm = {
  name: '',
  price: 0,
  image: '',
  storage: '',
  color: '',
  description: '',
  category: 'iphone-15-series',
  modelType: 'standard',
  stock: 0,
  discount: 0
};

export default function Admin() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const [p, o] = await Promise.all([
        productApi.list(),
        orderApi.list(token || undefined)
      ]);
      // Normalize API responses: some endpoints return { data: [...] }, others return array directly
      setProducts(p?.data ?? p ?? []);
      setOrders(o?.data ?? o ?? []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const revenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Vui lòng đăng nhập để thao tác');
      return;
    }
    setLoading(true);
    try {
      // Client-side validation prior to submit to avoid server-side 400
      const urlRegex = /^https?:\/\//i;
      const allowedStorages = ['64GB', '128GB', '256GB', '512GB', '1TB'];
      if (!form.name) { toast.error('Tên sản phẩm bắt buộc'); setLoading(false); return; }
      if (!form.price || Number(form.price) < 0) { toast.error('Giá phải là số >= 0'); setLoading(false); return; }
      if (!form.image || !urlRegex.test(form.image)) { toast.error('Vui lòng nhập URL hình ảnh hợp lệ (http(s)://...)'); setLoading(false); return; }
      if (!allowedStorages.includes(form.storage)) { toast.error('Storage phải là một trong: ' + allowedStorages.join(', ')); setLoading(false); return; }
      if (!form.color) { toast.error('Color bắt buộc'); setLoading(false); return; }
      if (!form.description) { toast.error('Description bắt buộc'); setLoading(false); return; }
      if (form.discount && (form.discount < 0 || form.discount > 100)) { toast.error('Discount phải nằm trong 0-100'); setLoading(false); return; }

      const payload = { ...form };
      if (form._id) {
        await productApi.update(token, form._id, payload);
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await productApi.create(token, payload);
        toast.success('Thêm sản phẩm thành công');
      }
      setForm(emptyForm);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Lưu sản phẩm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setForm({
      _id: p._id,
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
    if (!token) {
      toast.error('Vui lòng đăng nhập để thao tác');
      return;
    }
    if (!window.confirm('Xóa sản phẩm này?')) return;
    try {
      await productApi.remove(token, id);
      toast.success('Đã xóa sản phẩm');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Xóa thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quản lý doanh thu</h1>
          <p className="text-lg text-gray-700">Tổng doanh thu: <span className="font-semibold">${revenue.toFixed(2)}</span></p>
          <p className="text-sm text-gray-500 mt-1">Số đơn: {orders.length}</p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{form._id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Tên sản phẩm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Giá"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Link ảnh"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
            />
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Dung lượng (VD: 128GB)"
              value={form.storage}
              onChange={(e) => setForm({ ...form, storage: e.target.value })}
              required
            />
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Màu sắc"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              required
            />
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="iphone-15-series">iPhone 15 series</option>
              <option value="iphone-14-series">iPhone 14 series</option>
              <option value="iphone-13-series">iPhone 13 series</option>
              <option value="refurbished">Refurbished</option>
            </select>
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={form.modelType}
              onChange={(e) => setForm({ ...form, modelType: e.target.value })}
            >
              <option value="standard">Standard</option>
              <option value="pro">Pro</option>
              <option value="pro-max">Pro Max</option>
            </select>
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Tồn kho"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              required
            />
            <input
              className="border border-gray-300 rounded px-3 py-2"
              placeholder="Giảm giá (%)"
              type="number"
              value={form.discount ?? 0}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
            />
            <textarea
              className="border border-gray-300 rounded px-3 py-2 md:col-span-2"
              placeholder="Mô tả"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : form._id ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {form._id && (
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300"
                  onClick={() => setForm(emptyForm)}
                >
                  Làm mới
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh sách sản phẩm</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Tên</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Giá</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Tồn</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Danh mục</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Loại</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((p) => (
                  <tr key={p._id}>
                    <td className="px-3 py-2">{p.name}</td>
                    <td className="px-3 py-2">${(p.discountPrice || p.price)?.toLocaleString()}</td>
                    <td className="px-3 py-2">{p.stock}</td>
                    <td className="px-3 py-2">{p.category}</td>
                    <td className="px-3 py-2">{p.modelType}</td>
                    <td className="px-3 py-2 flex space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => handleEdit(p)}
                      >
                        Sửa
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(p._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


