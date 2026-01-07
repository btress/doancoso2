import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type FormData = {
  name: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  paymentMethod: string;
};

export default function Checkout() {
  const { items, clear, remove } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, it) => s + (it.product?.discountPrice ?? it.product?.price ?? 0) * it.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + tax + shipping;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      paymentMethod: 'cash_on_delivery'
    }
  });

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const getProductId = (it: any) => {
      const p = it.product;
      if (!p) return null;
      if (typeof p === 'string') return p;
      if (p._id) return String(p._id);
      if (p.id) return String(p.id);
      if (p.productId) return String(p.productId);
      return null;
    };

    const invalidItems = items.filter(i => !getProductId(i));
    if (invalidItems.length > 0) {
      // try to remove invalid items from server-side cart if possible
      try {
        await Promise.all(
          invalidItems.map((it) => (it._id ? remove(it._id) : Promise.resolve()))
        );
      } catch (err) {
        void err;
      }
      toast.error('Some cart items were invalid and have been removed. Please review your cart.');
      navigate('/cart');
      return;
    }

    const payload = {
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        }
      },
      items: items.map(i => ({
        product: getProductId(i),
        name: i.product?.name ?? '',
        quantity: i.quantity,
        price: Number(i.product?.discountPrice ?? i.product?.price ?? (i as any).price ?? 0),
        color: i.color,
        storage: i.storage
      })),
      subtotal,
      tax,
      shipping,
      totalAmount: total,
      paymentMethod: data.paymentMethod
    };

    try {
      console.debug('Order payload:', payload);
      await orderApi.create(payload);
      toast.success('Order placed successfully');
      await clear();
      navigate('/thank-you');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to place order';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full name</label>
              <input {...register('name', { required: true })} className="mt-1 block w-full px-3 py-2 border rounded" />
              {errors.name && <p className="text-sm text-red-600">Name is required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input {...register('email', { required: true })} className="mt-1 block w-full px-3 py-2 border rounded" />
              {errors.email && <p className="text-sm text-red-600">Email is required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input {...register('phone')} className="mt-1 block w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input {...register('street')} className="mt-1 block w-full px-3 py-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input {...register('city')} className="mt-1 block w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input {...register('state')} className="mt-1 block w-full px-3 py-2 border rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ZIP</label>
                <input {...register('zipCode')} className="mt-1 block w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input {...register('country')} className="mt-1 block w-full px-3 py-2 border rounded" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h2 className="font-semibold">Order Summary</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h2 className="font-semibold mb-2">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input {...register('paymentMethod')} type="radio" value="credit_card" className="mr-2" /> Credit / Debit Card
                </label>
                <label className="flex items-center">
                  <input {...register('paymentMethod')} type="radio" value="paypal" className="mr-2" /> PayPal
                </label>
                <label className="flex items-center">
                  <input {...register('paymentMethod')} type="radio" value="apple_pay" className="mr-2" /> Apple Pay
                </label>
                <label className="flex items-center">
                  <input {...register('paymentMethod')} type="radio" value="cash_on_delivery" className="mr-2" defaultChecked /> Cash on Delivery
                </label>
              </div>
            </div>

            <div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-3 rounded">
                {isSubmitting ? 'Placing order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
