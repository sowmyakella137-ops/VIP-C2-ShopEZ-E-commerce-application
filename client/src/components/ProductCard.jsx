import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { Star, ShoppingCart, Check, AlertCircle } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to detail page if clicked from link
    e.stopPropagation();
    
    setErrorMsg("");
    const res = await addToCart(product._id, 1);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      setErrorMsg(res.message || "Failed to add.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  // Calculate percentage discount
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 hover:border-emerald-250 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 flex flex-col h-full overflow-hidden group relative"
      id={`product-card-${product._id}`}
    >
      {/* Badge Sales Label */}
      {hasDiscount && (
        <span className="absolute top-3.5 left-3.5 bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider z-10 animate-pulse-subtle">
          -{discountPercent}% OFF
        </span>
      )}

      {/* Product Image Section */}
      <Link to={`/products/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-50" id={`product-img-link-${product._id}`}>
        <img
          src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-wide uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Details Container */}
      <div className="p-4.5 flex-grow flex flex-col justify-between" id={`product-info-${product._id}`}>
        <div>
          {/* Category & Brand Header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            <span>{product.category}</span>
            <span className="max-w-[120px] truncate">{product.brand}</span>
          </div>

          {/* Product Name Link */}
          <Link
            to={`/products/${product._id}`}
            className="block text-base font-bold text-slate-900 hover:text-emerald-600 line-clamp-2 leading-snug mb-2 transition-colors"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Product Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(product.rating || 0) ? "fill-amber-500 stroke-amber-500" : "text-slate-200 stroke-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500">
              {product.rating > 0 ? product.rating.toFixed(1) : "No reviews"}
            </span>
          </div>
        </div>

        {/* Pricing Layout */}
        <div>
          <div className="flex items-baseline gap-2.5 mb-4.5">
            <span className="text-xl font-extrabold text-slate-900">₹{displayPrice.toLocaleString("en-IN")}</span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through font-medium">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {errMsgCallback(errorMsg)}

          {/* Action Trigger button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-2.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all duration-300 shadow-xs cursor-pointer ${
              added
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-inner"
                : product.stock <= 0
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100 active:scale-97 cursor-pointer"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function errMsgCallback(errorMsg) {
  if (!errorMsg) return null;
  return (
    <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1.5 rounded-lg mb-2 text-xs font-semibold border border-rose-100 animate-shake">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate">{errorMsg}</span>
    </div>
  );
}
