import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { ShoppingBag, Search, Filter, RefreshCw, ArrowLeft, MoreHorizontal, Calendar, Eye, AlertCircle } from "lucide-react";

const STATUS_OPTIONS = ["All Statuses", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Filtering and search configs
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await api.get("/api/admin/orders");
      if (response.data?.success) {
        setOrders(response.data.orders || []);
      } else {
        setErrorMsg("Failed to gather customer order list.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with checkout database.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await api.put(`/api/admin/orders/${orderId}`, {
        orderStatus: newStatus
      });
      if (response.data?.success) {
        alert(`Order status upgraded to: ${newStatus}`);
        // Refresh local listings
        fetchOrders();
      } else {
        alert(response.data?.message || "Failed to update order status.");
      }
    } catch (err) {
      alert("Something went wrong changing order state.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-150 text-xs";
      case "Delivered":
        return "bg-emerald-50 text-emerald-800 border-emerald-150 text-xs";
      case "Cancelled":
        return "bg-rose-50 text-rose-800 border-rose-150 text-xs";
      case "Processing":
      default:
        return "bg-amber-55 text-amber-80 *border-amber-150 text-xs";
    }
  };

  // Filter orders locally
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && orders.length === 0) return <Loader fullPage={true} message="Accessing customer receipts db..." />;

  return (
    <div className="space-y-8" id="admin-orders-page">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-440 hover:text-indigo-650 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Executive Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-909 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-indigo-650" />
            Manage Client Orders
          </h1>
          <p className="text-sm font-semibold text-slate-404">Review packages, track deliverables, or adjust shipping parameters.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-250 text-rose-705 text-sm p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Filter and Search Dashboard */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-xs">
        
        {/* Search Input Box */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-404" />
          <input
            type="text"
            placeholder="Search by checkout ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-250 hover:border-slate-350 focus:border-indigo-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all text-slate-800"
          />
        </div>

        {/* Status Dropdowns Filter */}
        <div className="md:col-span-4 relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-404" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-250 hover:border-slate-350 focus:border-indigo-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((statusItem) => (
              <option key={statusItem} value={statusItem}>
                {statusItem}
              </option>
            ))}
          </select>
        </div>

        {/* Action Triggers */}
        <div className="md:col-span-3 flex justify-end">
          <button
            onClick={fetchOrders}
            className="w-full md:w-auto p-3 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
            title="Reload receipt index"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Index
          </button>
        </div>

      </div>

      {/* Main Table view */}
      {filteredOrders.length === 0 ? (
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-16 space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-905">No matches found</h3>
            <p className="text-sm font-medium text-slate-500">We couldn't locate any transaction receipts details matching this search.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden" id="admin-orders-table-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-semibold text-slate-650 min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-xs text-slate-404 font-black uppercase tracking-wider">
                  <th className="py-4 px-6">ID & Date</th>
                  <th className="py-4 px-4">Contact</th>
                  <th className="py-4 px-4">Delivery items</th>
                  <th className="py-4 px-4">Total Price</th>
                  <th className="py-4 px-4 font-black">Status update</th>
                  
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150" id="admin-orders-table-body">
                {filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* ID & date */}
                    <td className="py-4 px-6 space-y-1">
                      <p className="font-mono text-xs text-indigo-600 select-all font-black uppercase">{o._id}</p>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4 max-w-[160px]">
                      <p className="text-xs font-extrabold text-slate-800 truncate" title={o.user?.name || "Customer"}>
                        {o.user?.name || "Regular Customer"}
                      </p>
                      <p className="text-[10px] text-slate-404 font-semibold truncate mt-0.5">{o.user?.email || ""}</p>
                    </td>

                    {/* Deliverables snippet */}
                    <td className="py-4 px-4 max-w-[200px]">
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {o.items?.[0]?.name || "Packages item"}
                      </p>
                      {o.items?.length > 1 && (
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mt-0.5">
                          + {o.items.length - 1} other packages
                        </p>
                      )}
                    </td>

                    {/* Balance price */}
                    <td className="py-4 px-4">
                      <span className="text-sm font-black text-slate-900">
                        ₹{o.totalPrice.toLocaleString("en-IN")}
                      </span>
                      <p className="text-[10px] text-slate-404 uppercase font-black tracking-wider mt-0.5">
                        {o.paymentMethod}
                      </p>
                    </td>

                    {/* Status Upgrader Dropdown */}
                    <td className="py-4 px-4">
                      {updatingId === o._id ? (
                        <span className="text-xs text-slate-400 font-bold">Upgrading...</span>
                      ) : (
                        <select
                          value={o.orderStatus}
                          onChange={(e) => handleStatusUpdate(o._id, e.target.value)}
                          className={`px-3 py-1.5 text-xs font-extrabold border rounded-xl outline-hidden focus:outline-hidden appearance-none cursor-pointer ${getStatusBadgeStyle(o.orderStatus)}`}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </td>

                    

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
