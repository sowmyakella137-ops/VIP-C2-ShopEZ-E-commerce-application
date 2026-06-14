import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import CartItem from "../components/CartItem.jsx";
import { ShoppingBag, ArrowRight, ShieldCheck, ChevronRight, Ban, Trash2, ArrowLeft } from "lucide-react";
import Loader from "../components/Loader.jsx";

export default function CartPage() {
  const { cartItems, totalPrice, loading, clearCart } = useCart();
  const navigate = useNavigate();

  // Shipping cost: free above 500, else 50
  const freeShippingThreshold = 500;
  const deliveryCharge = totalPrice >= freeShippingThreshold || totalPrice === 0 ? 0 : 50;
  const grandTotal = totalPrice + deliveryCharge;

  // Remaining to free shipping
  const remainingForFreeShipping = freeShippingThreshold - totalPrice;

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to empty your shopping cart?")) {
      await clearCart();
    }
  };

  if (loading && cartItems.length === 0) {
    return <Loader fullPage={true} message="Reloading cart status..." />;
  }

  return (
    <div className="space-y-8" id="shopping-cart-page">
      
      {/* Title Header area */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6.5 h-6.5 text-emerald-600 stroke-[2.5]" />
          My Shopping Cart
        </h1>
        <p className="text-sm font-semibold text-slate-400">Review your goods before processing delivery details.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-5 max-w-lg mx-auto" id="cart-empty-basket">
          <div className="inline-flex bg-emerald-50 text-emerald-600 p-4 rounded-full border border-emerald-100">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900">Your Cart is Empty</h3>
            <p className="text-sm font-medium leading-relaxed text-slate-400">
              Looks like you haven't added any products to your basket yet. Check out our latest products!
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-emerald-50 active:scale-97"
            id="empty-cart-back-to-products"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart items table */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Header controls list */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Listing {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
              </p>
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-440 hover:text-rose-600 hover:underline transition-all cursor-pointer"
                id="cart-clear-btn"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Empty Cart
              </button>
            </div>

            {/* List block */}
            <div className="space-y-3" id="cart-item-list">
              {cartItems.map((item) => (
                <CartItem key={item.product} item={item} />
              ))}
            </div>

            <div className="pt-2">
              <Link to="/products" className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Keep Browsing Products
              </Link>
            </div>
          </div>

          {/* Right Column: Checkout Pricing Summary */}
          <div className="lg:col-span-4" id="cart-summary-sidebar">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h3>
                <p className="text-xs font-semibold text-slate-400">Tax, shipping rates, and promotional codes.</p>
              </div>

              {/* Free Courier Promotion helper */}
              {totalPrice < freeShippingThreshold ? (
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-605 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700 leading-normal font-semibold">
                    Add <span className="text-emerald-700 font-extrabold">₹{remainingForFreeShipping.toLocaleString("en-IN")}</span> more to unlock <span className="text-emerald-700 font-extrabold">FREE shipping</span>!
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-2xl flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-850 leading-normal font-bold">
                    Super savings! You unlocked <span className="text-emerald-600 font-black">FREE delivery</span> as your subtotal exceeds ₹500!
                  </div>
                </div>
              )}

              {/* Financial Items breakdown */}
              <div className="space-y-3 pt-2 border-t border-slate-100 text-sm">
                <div className="flex items-center justify-between text-slate-500 font-semibold">
                  <span>Cart Items Subtotal</span>
                  <span className="text-slate-800 font-bold">₹{totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 font-semibold animate-transition">
                  <span>Shipping & Handling</span>
                  <span className="text-slate-800 font-bold">
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toLocaleString("en-IN")}`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-500 font-semibold text-xs border-b border-dashed border-slate-150 pb-2.5">
                  <span>Convenience Tax</span>
                  <span className="text-emerald-605 font-bold">INCLUDED (GST)</span>
                </div>

                <div className="flex items-end justify-between font-black text-slate-900 pt-2 text-base">
                  <span>Grand Total</span>
                  <span className="text-xl text-slate-950">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Proceed to checkout trigger */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-2xl transition-all shadow-md shadow-emerald-50 active:scale-97 cursor-pointer flex items-center justify-center gap-2 mt-4"
                id="cart-checkout-btn"
              >
                Proceed to Checkout
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>

              {/* Secure transaction footnote */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-4 uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Encrypted Transactions</span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
