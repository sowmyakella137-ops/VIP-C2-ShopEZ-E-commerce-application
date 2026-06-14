import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { ChevronLeft, Calendar, FileText, MapPin, CreditCard, ShieldCheck, Truck, Sparkles, AlertCircle } from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchOrderDetails() {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await api.get(`/api/orders/${id}`);
        if (response.data?.success) {
          setOrder(response.data.order);
        } else {
          setErrorMsg("Failed to locate receipt parameters.");
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Something went wrong loading this receipt.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, [id]);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-250 text-emerald-800";
      case "Cancelled":
        return "bg-rose-55 text-rose-700 border-rose-200 text-rose-800";
      case "Processing":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 text-amber-800";
    }
  };

  const getPaymentStatusBadgeStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 text-emerald-800";
      case "Failed":
        return "bg-rose-50 text-rose-700 border-rose-250 text-rose-800";
      case "Pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 text-amber-800";
    }
  };

  if (loading) return <Loader fullPage={true} message="Accessing receipt database records..." />;
  if (errorMsg || !order) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto mt-12 space-y-4" id="order-detail-error">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-black text-slate-900">Receipt not found</h3>
        <p className="text-sm font-semibold text-slate-505 leading-relaxed">{errorMsg || "The transaction requested does not exist."}</p>
        <Link to="/orders" className="inline-flex bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8" id={`order-receipt-container-${order._id}`}>
      
      {/* Return link */}
      <div>
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-505 hover:text-emerald-600 transition-colors" id="order-detail-back">
          <ChevronLeft className="w-4 h-4" />
          Back to Orders History
        </Link>
      </div>

      {/* Header Panel */}
      <div className="bg-white border border-slate-250 p-5 md:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        
        {/* Meta values */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="bg-slate-100 text-slate-650 text-[10px] font-black px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <FileText className="w-3.5 h-3.5" />
              INVOICE RECEIPT
            </span>
            <span className="text-sm font-extrabold text-slate-400">ID:</span>
            <span className="text-slate-800 font-mono text-xs select-all uppercase font-black tracking-tight">{order._id}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric"
            })} at {new Date(order.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit"
            })}</span>
          </div>
        </div>

        {/* Status color displayers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1 md:text-right">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Order Status</p>
            <span className={`inline-flex items-center px-3.5 py-1 text-xs font-extrabold border rounded-full uppercase tracking-wider ${getStatusBadgeStyle(order.orderStatus)}`}>
              ● {order.orderStatus}
            </span>
          </div>
        </div>

      </div>

      {/* Main split row layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Purchased products detailed block list */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 tracking-tight">Ordered Items</h2>
          
          <div className="divide-y divide-slate-100" id="receipt-items-table">
            {order.items?.map((item, idx) => (
              <div key={item.product || idx} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover bg-slate-50 rounded-xl border border-slate-150 shrink-0"
                />
                <div className="flex-grow min-w-0">
                  <p className="text-sm md:text-base font-bold text-slate-900 line-clamp-1">{item.name}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    Unit price: ₹{item.price.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qty: {item.quantity}</p>
                  <p className="text-sm md:text-base font-black text-slate-900 mt-0.5">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Delivery Address, Payments, Financial recap */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 1: Courier Address details */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Shipping Destination
            </h3>
            {order.deliveryAddress ? (
              <div className="text-sm font-semibold text-slate-600 leading-relaxed space-y-1">
                <p className="font-extrabold text-slate-800">{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                <p className="text-xs font-black text-slate-400 mt-1 uppercase tracking-wider">Pincode: {order.deliveryAddress.pincode}</p>
              </div>
            ) : (
              <p className="text-xs text-rose-500 font-bold">Shipping address details missing from receipt database.</p>
            )}
          </div>

          {/* Section 2: Payment Parameters */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Payment Records
            </h3>
            <div className="text-sm space-y-3 font-semibold">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 uppercase tracking-wider">Gateway Method</span>
                <span className="text-slate-800 font-extrabold uppercase">{order.paymentMethod === "COD" ? "Cash On Delivery (COD)" : "Online Payment Gateway"}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-2">
                <span className="text-slate-400 uppercase tracking-wider">Verification State</span>
                <span className={`inline-flex px-2 py-0.5 font-bold text-[10px] rounded border uppercase tracking-wider ${getPaymentStatusBadgeStyle(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="text-[11px] leading-relaxed text-slate-450 border-t border-slate-100 pt-3">
                {order.paymentMethod === "Online"
                  ? order.paidAt
                    ? `Paid instantly via secure test-gateway on ${new Date(order.paidAt).toLocaleDateString()}`
                    : "Awaiting gateway parameters validation check."
                  : "Pay securely in cash or UPI when your hand-delivered package reaches your shipping destination."}
              </div>
            </div>
          </div>

          {/* Section 3: Financial summaries */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-black text-slate-905 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Amount Breakdown
            </h3>
            <div className="text-xs space-y-3 font-semibold text-slate-505">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="text-slate-800 font-bold">₹{order.itemsPrice?.toLocaleString("en-IN") || order.totalPrice?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charges</span>
                <span className="text-slate-800 font-bold">
                  {order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}
                </span>
              </div>

              <div className="flex justify-between items-center font-black text-slate-900 border-t border-slate-150 pt-2.5 text-sm">
                <span>Total Charge Paid</span>
                <span className="text-base text-slate-950 font-black">₹{order.totalPrice?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
