import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { productApi, commentApi } from '../services/api';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const { addOrUpdate } = useCart();
  const { token, user } = useAuth();

  useEffect(() => {
    if (!id) return;
    productApi.detail(id).then((res) => setProduct(res.data)).catch(() => setProduct(null));
    commentApi.list(id).then((res) => setComments(res.data)).catch(() => setComments([]));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please login to add to cart');
      return;
    }
    if (!id) return;
    await addOrUpdate({ productId: id, quantity: 1, color: product?.color, storage: product?.storage });
    toast.success('Added to cart');
  };

  const handleAddComment = async () => {
    if (!token || !id) {
      toast.error('Please login to comment');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const res = await commentApi.add(token, id, { content: commentText, rating });
      setComments((prev) => [res.data, ...prev]);
      setCommentText('');
      toast.success('Comment added');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    }
  };

  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0;
    const validRatings = comments.filter((c) => c.rating);
    if (validRatings.length === 0) return 0;
    return validRatings.reduce((sum, item) => sum + (item.rating || 0), 0) / validRatings.length;
  }, [comments]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-center text-gray-600">Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="aspect-square bg-gray-50 rounded-lg p-8">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-black">${(product.discountPrice || product.price)?.toLocaleString()}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">({comments.length} reviews)</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                <span>Storage: {product.storage}</span>
                <span>Color: {product.color}</span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
            <ul className="space-y-3">
              {product.features?.map((feature: string, index: number) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            <div className="space-y-6">
              {user && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Add a review</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm text-gray-600">Rating:</span>
                    {[1,2,3,4,5].map((value) => (
                      <button key={value} onClick={() => setRating(value)}>
                        <Star className={`w-5 h-5 ${value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                    rows={3}
                    placeholder="Share your experience..."
                  />
                  <button
                    onClick={handleAddComment}
                    className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              )}
              {comments.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{review.content}</p>
                  <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}