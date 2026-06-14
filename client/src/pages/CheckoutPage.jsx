import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { CreditCard, Truck, ShieldCheck, MapPin, ChevronLeft, AlertCircle, ShoppingCart } from "lucide-react";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, totalPrice, fetchCart } = useCart();
  const navigate = useNavigate();

  // Address Inputs prefilled with saved profile values
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Payment Selection states
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Pre-fill addresses on load
  useEffect(() => {
    if (user && user.address) {
      setStreet(user.address.street || "");
      setCity(user.address.city || "");
      setState(user.address.state || "");
      setPincode(user.address.pincode || "");
    }
  }, [user]);

  // Handle redirect if cart was cleared/empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      // Cart empty, redirect to cart page
      navigate("/cart", { replace: true });
    }
  }, [cartItems, navigate]);

  // Delivery breakdown
  const freeShippingThreshold = 500;
  const deliveryCharge = totalPrice >= freeShippingThreshold ? 0 : 50;
  const grandTotal = totalPrice + deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!street || !city || !state || !pincode) {
      setErrorMsg("Please complete the delivery address form.");
      return;
    }

    try {
      setIsSubmitting(true);
      const deliveryAddress = { street, city, state, pincode };
      
      const response = await api.post("/api/orders", {
        deliveryAddress,
        paymentMethod
      });

      if (response.data?.success) {
        // Success, refresh central cart count so navbar is accurate
        await fetchCart();
        // Route to my orders
        navigate("/orders", { replace: true });
      } else {
        setErrorMsg(response.data?.message || "Failed to finalize order.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong during check-out checkout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return <Loader message="Verifying shopping cart..." />;
  }

  return (
    <div className="space-y-8" id="checkout-page">
      
      {/* Title Header */}
      <div>
        <Link to="/cart" className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-500 hover:text-emerald-600 transition-colors mb-2" id="checkout-back-link">
          <ChevronLeft className="w-4 h-4" />
          Back to Shopping Cart
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-400">Provide shipping coordinates and final payment methods.</p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-750 text-sm p-4 rounded-xl max-w-4xl mx-auto" id="checkout-overall-error">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Main Grid split */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="checkout-form">
        
        {/* Left Column: Delivery Form and Payment Cards */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="bg-emerald-50 text-emerald-600 p-2 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-905 tracking-tight">Delivery Address</h2>
                <p className="text-xs font-semibold text-slate-400">Where should we deliver your order?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="ship-street">Street Address</label>
                <input
                  id="ship-street"
                  type="text"
                  placeholder="Appt#, House No, Street name"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-slate-250 bg-slate-50 rounded-xl focus:border-emerald-500 focus:bg-white text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-505 uppercase tracking-wider" htmlFor="ship-city">City</label>
                  <input
                    id="ship-city"
                    type="text"
                    placeholder="Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-250 bg-slate-50 rounded-xl focus:border-emerald-500 focus:bg-white text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-505 uppercase tracking-wider" htmlFor="ship-state">State</label>
                  <input
                    id="ship-state"
                    type="text"
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-250 bg-slate-50 rounded-xl focus:border-emerald-500 focus:bg-white text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-505 uppercase tracking-wider" htmlFor="ship-pin">Pincode</label>
                  <input
                    id="ship-pin"
                    type="text"
                    placeholder="560001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-slate-250 bg-slate-50 rounded-xl focus:border-emerald-500 focus:bg-white text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Option cards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="bg-emerald-50 text-emerald-600 p-2 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-905 tracking-tight">Payment Method</h2>
                <p className="text-xs font-semibold text-slate-400">Choose your preferred checkout mode.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* COD Method Box */}
              <label className={`border rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:bg-slate-50"}`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1 select-none">
                  <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    Cash On Delivery (COD)
                  </p>
                  <p className="text-xs text-slate-500 leading-normal font-medium">Pay securely in cash or UPI when the courier delivers to your door.</p>
                </div>
              </label>

              {/* Online Method Box */}
              <label className={`border rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all ${paymentMethod === "Online" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:bg-slate-50"}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={() => setPaymentMethod("Online")}
                  disabled={isSubmitting}
                  className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="space-y-1 select-none">
                  <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    Instant Online Portal
                  </p>
                  <p className="text-xs text-slate-500 leading-normal font-medium">Verify through mock test gateway parameters. Instant confirmation.</p>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right Column: Order Items Summary Rows */}
        <div className="lg:col-span-4" id="checkout-sidebar">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
            
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <ShoppingCart className="w-5 h-5 text-slate-400" />
                Cart Verification
              </h3>
            </div>

            {/* List mini cart rows */}
            <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1 shrink-0">
              {cartItems.map((item) => (
                <div key={item.product} className="flex items-center gap-3 text-xs bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border bg-white shrink-0" />
                  <div className="flex-grow min-w-0">
                    <p className="font-extrabold text-slate-800 truncate">{item.name}</p>
                    <p className="text-slate-400 font-bold">Qty: {item.quantity} x ₹{item.price.toLocaleString("en-IN")}</p>
                  </div>
                  <span className="font-black text-slate-900 shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {/* Financial balance detail */}
            <div className="space-y-3 border-t border-slate-100 pt-4 text-xs font-semibold">
              <div className="flex items-center justify-between text-slate-500">
                <span>Products Subtotal</span>
                <span className="text-slate-800 font-extrabold">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Shipping & Delivery</span>
                <span className="text-slate-800 font-extrabold">
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="flex items-center justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-150">
                <span>Final Total Amount</span>
                <span className="text-lg text-slate-950 font-black">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Place Order submit trigger */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-350 text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-emerald-50 active:scale-97 cursor-pointer flex items-center justify-center gap-2 mt-2 transition-all text-sm"
              id="checkout-finalize-btn"
            >
              {isSubmitting ? <Loader message="Placing order..." /> : (
                <>
                  <Truck className="w-5 h-5" />
                  Place Final Order
                </>
              )}
            </button>

            {/* Secure payment endorsement */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-3 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full Purchaser Security Guaranteed</span>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
