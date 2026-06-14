import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { Package, Plus, Pencil, Trash2, Search, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await api.get("/api/products");
      if (response.data?.success) {
        setProducts(response.data.products || []);
      } else {
        setErrorMsg("Failed to gather product catalog.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with product server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action is permanent!")) {
      try {
        const response = await api.delete(`/api/admin/products/${productId}`);
        if (response.data?.success) {
          alert("Product deleted successfully!");
          // Refresh products
          fetchProducts();
        } else {
          alert(response.data?.message || "Failed to delete product.");
        }
      } catch (err) {
        alert("Something went wrong communicating with administrative servers.");
      }
    }
  };

  // Filter products by keyword locally
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) return <Loader fullPage={true} message="Accessing inventory..." />;

  return (
    <div className="space-y-8" id="admin-products-catalog">
      
      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-440 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Executive Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-7 h-7 text-indigo-650" />
            Manage Inventory
          </h1>
          <p className="text-sm font-semibold text-slate-400">Total catalog offerings: {products.length} products</p>
        </div>

        {/* Create Product Button */}
        <Link
          to="/admin/products/add"
          className="bg-indigo-600 hover:bg-indigo-705 text-white text-xs font-extrabold px-5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100 transition-all cursor-pointer self-start md:self-auto"
          id="admin-add-product-shortcut"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Catalog Product
        </Link>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-250 text-rose-700 text-sm p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Configuration search card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4.5 flex items-center gap-4 shadow-xs">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search items by name, brand, or category class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-250 hover:border-slate-350 focus:border-indigo-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all"
          />
        </div>
        
        <button
          onClick={fetchProducts}
          className="p-3 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 rounded-xl transition-all cursor-pointer"
          title="Force refresh index"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main product listings collection */}
      {filteredProducts.length === 0 ? (
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-16 space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-905">No products found</h3>
            <p className="text-sm font-medium text-slate-500">We couldn't locate any products in the catalog index.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden" id="admin-inventory-terminal-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-semibold text-slate-650 min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-xs text-slate-400 font-black uppercase tracking-wider">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-4">Properties</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150" id="admin-products-table-body">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Image thumb */}
                    <td className="py-4 px-6 shrink-0">
                      <img
                        src={p.images?.[0]?.url || ""}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover bg-slate-50 rounded-lg border border-slate-150 shrink-0"
                      />
                    </td>

                    {/* Properties (Name & Brand) */}
                    <td className="py-4 px-4 max-w-[240px]">
                      <p className="text-sm font-bold text-slate-900 truncate" title={p.name}>{p.name}</p>
                      <p className="text-xs text-slate-400 uppercase font-black tracking-wider mt-0.5">{p.brand}</p>
                    </td>

                    {/* Class category */}
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-650 text-[10px] font-black px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-wide">
                        {p.category}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-slate-950">
                          ₹{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString("en-IN")}
                        </span>
                        {p.discountPrice > 0 && (
                          <p className="text-[10px] text-slate-400 font-bold line-through">
                            ₹{p.price.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Stock level indicator */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-extrabold ${p.stock > 5 ? "text-slate-800" : p.stock > 0 ? "text-amber-600 font-black animate-pulse-subtle" : "text-rose-600 font-black"}`}>
                        {p.stock} units
                      </span>
                    </td>

                    {/* Action controls */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-2 border border-slate-200 hover:border-indigo-150 hover:bg-indigo-50 text-slate-500 hover:text-indigo-700 rounded-xl transition-all inline-flex items-center justify-center shrink-0 cursor-pointer"
                          title="Edit catalog product"
                          id={`edit-prod-row-${p._id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 border border-transparent hover:border-rose-150 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all inline-flex items-center justify-center shrink-0 cursor-pointer"
                          title="Delete catalog product"
                          id={`del-prod-row-${p._id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
