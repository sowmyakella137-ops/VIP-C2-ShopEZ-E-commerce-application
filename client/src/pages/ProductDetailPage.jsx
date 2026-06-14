import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Loader from "../components/Loader.jsx";
import { Star, ShoppingCart, ChevronLeft, Calendar, Send, Check, AlertCircle } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Cart adding configs
  const [qty, setQty] = useState(1);
  const [cartAdding, setCartAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Review submission Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await api.get(`/api/products/${id}`);
      if (response.data?.success) {
        setProduct(response.data.product);
      } else {
        setErrorMsg("Failed to gather product details.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong loading this product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleQtyChange = (val) => {
    const nextVal = Math.max(1, Math.min(product.stock, val));
    setQty(nextVal);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setCartAdding(true);
      setAddSuccess(false);
      const res = await addToCart(product._id, qty);
      if (res.success) {
        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 3000);
      } else {
        alert(res.message || "Failed to add items to cart.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCartAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!comment.trim()) {
      setReviewError("Please type a comment for your review.");
      return;
    }

    try {
      setReviewSubmitting(true);
      const response = await api.post(`/api/products/${id}/review`, { rating, comment });
      if (response.data?.success) {
        setComment("");
        setRating(5);
        // Refresh product details to load new reviews
        await fetchProductDetails();
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to post review. You may have reviewed this item already.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage={true} message="Accessing product information..." />;
  if (errorMsg || !product) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 space-y-4 max-w-lg mx-auto mt-12" id="detail-error-container">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-900">Product not found</h3>
        <p className="text-sm font-semibold text-slate-500 leading-relaxed">{errorMsg || "The product requested does not exist."}</p>
        <Link to="/products" className="inline-flex bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 105) : 0;

  return (
    <div className="space-y-12" id={`details-container-${product._id}`}>
      
      {/* Navigation Breadcrumbs */}
      <div>
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-emerald-600 transition-colors" id="details-back-link">
          <ChevronLeft className="w-4 h-4" />
          Back to Products Catalog
        </Link>
      </div>

      {/* Primary Layout columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* Left Column: Media Gallery */}
        <div className="md:col-span-5 space-y-4">
          <div className="aspect-square bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs relative">
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider z-10">
                On Sale
              </span>
            )}
            <img
              src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Right Column: Descriptions & Actions */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3.5xl font-serif font-light text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-slate-400">Brand: <span className="text-slate-700">{product.brand}</span></p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(product.rating || 0) ? "fill-amber-500 stroke-amber-500" : "text-slate-100 stroke-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-600">
              {product.rating > 0 ? `${product.rating.toFixed(1)} / 5.0` : "No ratings yet"}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {product.numReviews} {product.numReviews === 1 ? "Customer review" : "Customer reviews"}
            </span>
          </div>

          <div className="border-t border-slate-150 pt-5">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black text-slate-950">₹{displayPrice.toLocaleString("en-IN")}</span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through font-semibold">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-xs font-black text-rose-500 uppercase tracking-wide">
                Special savings: you save ₹{(product.price - product.discountPrice).toLocaleString("en-IN")}!
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Product Highlights</h3>
            <p className="text-sm md:text-base leading-relaxed text-slate-600 font-medium">
              {product.description}
            </p>
          </div>

          {/* Purchasing actions */}
          <div className="border-t border-slate-150 pt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              
              {/* stock status summary */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 5 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500 animate-ping" : "bg-rose-500"}`} />
                <span className="text-xs font-extrabold uppercase tracking-wide">
                  {product.stock > 5 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} units remaining!` : "Sold Out"}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                
                {/* Quantity widget */}
                <div className="flex items-center border border-slate-250 bg-slate-50 rounded-xl px-1.5 py-1.5 w-max">
                  <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider select-none">Qty</span>
                  <button
                    onClick={() => handleQtyChange(qty - 1)}
                    className="w-8 h-8 flex items-center justify-center font-extrabold text-slate-600 hover:text-emerald-600 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => handleQtyChange(Number(e.target.value))}
                    className="w-10 text-center font-extrabold text-slate-800 bg-transparent border-0 ring-0 focus:ring-0 outline-hidden focus:outline-hidden"
                  />
                  <button
                    onClick={() => handleQtyChange(qty + 1)}
                    className="w-8 h-8 flex items-center justify-center font-extrabold text-slate-600 hover:text-emerald-600 hover:bg-white border border-transparent hover:border-slate-100 rounded-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to trolley button */}
                <button
                  onClick={handleAddToCart}
                  disabled={cartAdding || product.stock <= 0}
                  className={`flex-grow sm:flex-grow-0 sm:px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-extrabold rounded-xl transition-all shadow-md shadow-emerald-50 active:scale-97 cursor-pointer flex items-center justify-center gap-2 ${addSuccess ? "bg-emerald-50 border border-emerald-250 text-emerald-600 shadow-inner" : ""}`}
                >
                  {addSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                      Saved in Checkout!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Shopping Cart
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Segment: Reviews & Comments Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-150 pt-12">
        
        {/* Left/Top: Reviews list */}
        <div className="lg:col-span-7 space-y-6" id="reviews-list-container">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-light text-slate-900 tracking-tight flex items-center gap-1.5">
              Customer <span className="italic font-serif font-normal text-emerald-600">Reviews</span>
            </h2>
            <p className="text-xs font-semibold text-slate-404">Check what other verified users have to share.</p>
          </div>

          {product.reviews.length === 0 ? (
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-8 text-center text-slate-400 font-semibold text-sm">
              No reviews documented for this item yet. Be the first to leave one!
            </div>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((rev, index) => (
                <div key={index} className="bg-white border border-slate-150 p-4.5 rounded-2xl flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">{rev.name}</p>
                      <div className="flex items-center text-amber-500 gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${starIdx < rev.rating ? "fill-amber-500 stroke-amber-500" : "text-slate-100 stroke-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Timestamp */}
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Verified Purchaser</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right/Bottom: Submit review Form (Requires Token) */}
        <div className="lg:col-span-5 bg-white border border-slate-150 rounded-3xl p-6 h-max space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-light text-slate-900 tracking-tight">Submit <span className="italic font-serif font-normal text-emerald-600">Feedback</span></h3>
            <p className="text-xs font-semibold text-slate-450">Share your experience with this item.</p>
          </div>

          {token ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4" id="review-submission-form">
              {reviewError && (
                <div className="flex items-start gap-1.5 bg-rose-50 border border-rose-150 text-rose-600 text-xs p-2.5 rounded-lg font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{reviewError}</span>
                </div>
              )}

              {/* Star Selectors */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-404 uppercase tracking-wider">Overall Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-6 h-6 stroke-2 ${
                          star <= rating ? "fill-amber-500 stroke-amber-500" : "text-slate-200 hover:text-amber-300 stroke-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider" htmlFor="review-comment">Review Details</label>
                <textarea
                  id="review-comment"
                  rows={4}
                  placeholder="Tell customers what you liked or disliked about this product..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3.5 border border-slate-250 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all placeholder:text-slate-300 placeholder:font-medium text-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {reviewSubmitting ? <Loader message="Posting..." /> : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Publish Feedback
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 text-center space-y-3.5" id="review-anon-state">
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                You must login to add a product evaluation or rate this design.
              </p>
              <Link
                to="/login"
                className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-50 active:scale-97"
              >
                Login and Review
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
