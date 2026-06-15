import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Sparkles,
  Users,
  Image,
  ArrowRight,
  Clock,
  AlertCircle,
  PiggyBank,
  ChevronRight,
  ClipboardList
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ productsCount: 0, ordersCount: 0, usersCount: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        setLoading(true);
        setErrorMsg("");
        
        // Load All Products, Admin Orders, and Admin Users in parallel
        const [prodRes, orderRes, userRes] = await Promise.all([
          api.get("/api/products"),
          api.get("/api/admin/orders"),
          api.get("/api/admin/users")
        ]);

        let pCount = 0;
        let oCount = 0;
        let uCount = 0;
        let revenue = 0;
        let rOrders = [];

        if (prodRes.data?.success) {
          pCount = prodRes.data.count || 0;
        }
        if (orderRes.data?.success) {
          const ordersList = orderRes.data.orders || [];
          oCount = ordersList.length;
          rOrders = ordersList.slice(0, 5); // display topmost 5 transactions
          revenue = ordersList.reduce((acc, current) => {
            if (current.orderStatus !== "Cancelled") {
              return acc + current.totalPrice;
            }
            return acc;
          }, 0);
        }
        if (userRes.data?.success) {
          uCount = userRes.data.count || 0;
        }

        setStats({
          productsCount: pCount,
          ordersCount: oCount,
          usersCount: uCount,
          totalRevenue: revenue
        });
        setRecentOrders(rOrders);

      } catch (err) {
        setErrorMsg("Failed to gather administrative analytics from server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardStats();
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-100 text-xs";
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-100 text-xs";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-100 text-xs";
      case "Processing":
      default:
        return "bg-amber-55 text-amber-800 border-amber-100 text-xs";
    }
  };

  if (loading) return <Loader fullPage={true} message="Assembling administrative stats panel..." />;

  const statCards = [
    { title: "Catalog Products", value: stats.productsCount, icon: Package, color: "bg-blue-50 text-blue-600 border-blue-100" },
    { title: "All Client Orders", value: stats.ordersCount, icon: ShoppingBag, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { title: "Registered Users", value: stats.usersCount, icon: Users, color: "bg-purple-50 text-purple-600 border-purple-100" },
    { title: "Net Revenue (Rupees)", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, icon: PiggyBank, color: "bg-emerald-50 text-emerald-600 border-emerald-105" }
  ];

  return (
    <div className="space-y-8" id="admin-dashboard-container">
      
      {/* Upper header segment and quick config navigation tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            ADMIN SECURITY CONSOLE
          </span>
          <h1 className="text-2xl md:text-3.5xl font-serif font-light text-slate-900 tracking-tight">Executive <span className="font-serif italic font-normal text-emerald-600">Dashboard</span></h1>
          <p className="text-sm font-semibold text-slate-400">Inventory modifications, order upgrades, and promotional panels.</p>
        </div>

        {/* Dashboard Actions Links bar */}
        <div className="flex flex-wrap items-center gap-2" id="admin-context-links">
          <Link to="/admin/products" className="bg-white border border-slate-200 text-slate-650 hover:text-emerald-600 hover:border-emerald-250 font-bold px-4 py-2 rounded-xl text-xs transition-colors">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="bg-white border border-slate-200 text-slate-650 hover:text-emerald-600 hover:border-emerald-250 font-bold px-4 py-2 rounded-xl text-xs transition-colors">
            Manage Orders
          </Link>
          <Link to="/admin/banners" className="bg-white border border-slate-200 text-slate-650 hover:text-emerald-600 hover:border-emerald-250 font-bold px-4 py-2 rounded-xl text-xs transition-colors">
            Promo Banners
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Grid: Stat cards indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="dashboard-widgets-row">
        {statCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-xs">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-black text-slate-905">{card.value}</p>
              </div>
              <div className={`p-3.5 rounded-xl border ${card.color}`}>
                <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent transactions grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-recent-row">
        
        {/* Left Column (Table layout of topmost transactions) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5.5 h-5.5 text-slate-400" />
              <h2 className="text-lg font-serif font-light text-slate-900 tracking-tight">Recent <span className="font-serif italic font-normal text-emerald-600">Orders</span></h2>
            </div>
            <Link to="/admin/orders" className="text-xs font-black text-indigo-650 hover:text-indigo-705 flex items-center gap-1 group">
              See All Orders
              <ChevronRight className="w-4 h-4 transition-all group-hover:translate-x-0.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-slate-50 border border-slate-150 p-8 rounded-2xl text-center text-slate-400 font-semibold text-sm">
              No client checkout transactions recorded on server yet.
            </div>
          ) : (
            <div className="overflow-x-auto" id="dashboard-orders-table">
              <table className="w-full text-left text-sm font-semibold text-slate-600 min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase font-black uppercase tracking-wider pb-3">
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Method</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-right">View Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-mono text-xs text-indigo-600 select-all font-black uppercase">{ord._id}</td>
                      <td className="py-3 font-black text-slate-900">₹{ord.totalPrice.toLocaleString("en-IN")}</td>
                      <td className="py-3 text-xs uppercase font-extrabold text-slate-500">{ord.paymentMethod}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-0.5 border rounded-full font-extrabold uppercase text-[10px] tracking-wider ${getStatusBadgeStyle(ord.orderStatus)}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
  to="/admin/orders"
  className="inline-flex text-xs font-extrabold text-indigo-600 hover:text-indigo-755 hover:underline"
>
  Manage Order
</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Shortcut guides and summaries */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6.5 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-serif font-light text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600 font-bold" />
              Product Operations
            </h3>
            
            <p className="text-xs text-slate-450 leading-relaxed font-semibold">
              Quickly create, compile, update, and manage products and categories, or schedule slider updates directly.
            </p>

            <div className="space-y-2.5 pt-1">
              <Link
                to="/admin/products/add"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                Add Catalog Product
              </Link>
              <Link
                to="/admin/banners"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                Add Promo Banner
              </Link>
            </div>
          </div>

          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 mt-6">
            <h4 className="text-xs font-black text-indigo-805 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Administrative Tip
            </h4>
            <p className="text-[11px] leading-relaxed text-indigo-700 font-semibold">
              When processing orders, update shipping statuses immediately to trigger shipping notification events for customer satisfaction.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
