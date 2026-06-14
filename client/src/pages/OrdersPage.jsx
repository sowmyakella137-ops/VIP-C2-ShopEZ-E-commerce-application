import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import { Package, Calendar, ChevronRight, AlertCircle, ShoppingBag, CreditCard } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await api.get("/api/users/orders");
        if (response.data?.success) {
          setOrders(response.data.orders || []);
        } else {
          setErrorMsg("Failed to load your transaction files.");
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Something went wrong fetching orders.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 text-emerald-800";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200 text-rose-800";
      case "Processing":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200 text-amber-800";
    }
  };

  if (loading) return <Loader fullPage={true} message="Accessing your receipts..." />;

  return (
    <div className="space-y-8" id="orders-page">
      
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Package className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
          My Orders History
        </h1>
        <p className="text-sm font-semibold text-slate-404">Track status, shipping records, and histories of all transactions.</p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-5 max-w-lg mx-auto" id="orders-empty-state">
          <div className="inline-flex bg-slate-50 text-slate-400 p-4 rounded-full border border-slate-200">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-slate-900">No Orders Documented</h3>
            <p className="text-sm font-medium leading-relaxed text-slate-400">
              You haven't placed any purchases through ShopEZ yet. Click below to browse our inventory!
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md shadow-emerald-50 active:scale-97"
            id="orders-browse-catalog-link"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4" id="orders-records-collection">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total transactions: {orders.length} orders
          </p>
          
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md hover:shadow-slate-50/50 transition-all p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                id={`user-order-row-${order._id}`}
              >
                {/* ID & Date Columns */}
                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center gap-1 text-xs text-slate-400 font-extrabold tracking-tight">
                    <span>ORDER ID:</span>
                    <span className="text-slate-805 select-all font-mono uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-150">{order._id}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Placed: {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })} at {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}</span>
                  </div>
                </div>

                {/* Items preview details */}
                <div className="md:col-span-3 space-y-1">
                  <p className="text-xs font-bold text-slate-404 uppercase tracking-wider">Items summary</p>
                  <p className="text-sm font-extrabold text-slate-800 line-clamp-1 leading-snug">
                    {order.items?.[0]?.name || "Purchased Goods"}
                  </p>
                  {order.items?.length > 1 && (
                    <p className="text-xs font-bold text-emerald-600">
                      + {order.items.length - 1} more items in packages
                    </p>
                  )}
                </div>

                {/* Pricing summary */}
                <div className="md:col-span-2 space-y-1">
                  <p className="text-xs font-bold text-slate-404 uppercase tracking-wider">Total Charge</p>
                  <p className="text-base font-black text-slate-905">₹{order.totalPrice.toLocaleString("en-IN")}</p>
                </div>

                {/* Status Badge */}
                <div className="md:col-span-2 shrink-0">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-extrabold border rounded-full uppercase tracking-wider ${getStatusBadgeStyle(order.orderStatus)}`}>
                    ● {order.orderStatus}
                  </span>
                </div>

                {/* Action arrow link */}
                <div className="md:col-span-1 text-right mt-2 md:mt-0">
                  <Link
                    to={`/orders/${order._id}`}
                    className="p-2 border border-slate-200 hover:border-emerald-250 hover:bg-emerald-50 hover:text-emerald-700 text-slate-400 rounded-xl inline-flex items-center justify-center transition-all cursor-pointer w-full md:w-auto"
                    id={`view-order-link-${order._id}`}
                    title="View Comprehensive receipt"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
