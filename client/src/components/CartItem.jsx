import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product, item.quantity - 1);
    } else {
      removeFromCart(item.product);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.product, item.quantity + 1);
  };

  const itemSubtotal = item.price * item.quantity;

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-xs hover:border-slate-200 transition-all gap-4"
      id={`cart-item-${item.product}`}
    >
      {/* Product Information row */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        {/* Product Image Thumbnail */}
        <Link to={`/products/${item.product}`} className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
          <img
            src={item.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop"}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Name and unit price */}
        <div className="flex-grow min-w-0">
          <Link
            to={`/products/${item.product}`}
            className="block text-sm sm:text-base font-bold text-slate-900 override-link hover:text-emerald-600 line-clamp-1 mb-1 transition-colors"
          >
            {item.name}
          </Link>
          <p className="text-xs font-bold text-slate-400 capitalize">Unit Price: ₹{item.price.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Product actions (quantity toggling, subtotal & removal) */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
        
        {/* Counter Widget */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 py-1 px-1.5 shrink-0 shadow-inner">
          <button
            onClick={handleDecrease}
            className="p-1 px-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all text-xs font-black cursor-pointer"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3.5 text-sm font-extrabold text-slate-800 select-none">{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className="p-1 px-2 text-slate-500 hover:text-emerald-600 hover:bg-white rounded-lg transition-all text-xs font-black cursor-pointer"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Subtotal Calculation */}
        <div className="text-right shrink-0 min-w-[90px]">
          <p className="text-sm font-semibold text-slate-400 text-left sm:text-right text-[10px] uppercase font-bold tracking-wider mb-0.5">Subtotal</p>
          <p className="text-base font-black text-slate-900 text-left sm:text-right">₹{itemSubtotal.toLocaleString("en-IN")}</p>
        </div>

        {/* Eradicate item trigger */}
        <button
          onClick={() => removeFromCart(item.product)}
          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all cursor-pointer"
          title="Remove from Cart"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>

      </div>
    </div>
  );
}
