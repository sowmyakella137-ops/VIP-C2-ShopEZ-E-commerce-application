import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import { Search, Filter, RefreshCw, Layers } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Books",
  "Groceries",
  "Home & Kitchen",
  "Sports",
  "Toys",
  "Beauty",
  "Other"
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local filter states synced with URL parameters
  const categoryParam = searchParams.get("category") || "All Categories";
  const keywordParam = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTxt, setSearchTxt] = useState(keywordParam);

  // Sync keyword in input when URL changes
  useEffect(() => {
    setSearchTxt(keywordParam);
  }, [keywordParam]);

  // Fetch product items matching current filters
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let url = "/api/products";
        const params = {};
        
        if (categoryParam && categoryParam !== "All Categories") {
          params.category = categoryParam;
        }
        if (keywordParam) {
          params.keyword = keywordParam;
        }

        const response = await api.get(url, { params });
        if (response.data?.success) {
          setProducts(response.data.products || []);
        }
      } catch (err) {
        console.error("Error loading products catalog", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [categoryParam, keywordParam]);

  const handleApplyFilters = (newCategory, newKeyword) => {
    const nextParams = {};
    if (newCategory && newCategory !== "All Categories") {
      nextParams.category = newCategory;
    }
    if (newKeyword) {
      nextParams.keyword = newKeyword;
    }
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchTxt("");
    setSearchParams({});
  };

  return (
    <div className="space-y-8" id="products-catalog-page">
      
      {/* Title Header area */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3.5xl font-serif font-light text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-6.5 h-6.5 text-emerald-600 stroke-[2.5]" />
          Products <span className="italic font-serif font-normal">Catalog</span>
        </h1>
        <p className="text-sm font-semibold text-slate-400">Discover and purchase premium quality organic items.</p>
      </div>

      {/* Filter & Search Dashboard Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-xs">
        
        {/* Keyword Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search keyword..."
            value={searchTxt}
            onChange={(e) => setSearchTxt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters(categoryParam, searchTxt)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-250 hover:border-slate-350 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all"
          />
        </div>

        {/* Category Dropdown Selection */}
        <div className="md:col-span-4 relative">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <select
            value={categoryParam}
            onChange={(e) => handleApplyFilters(e.target.value, keywordParam)}
            className="w-full pl-11 pr-4 py-2.5 border border-slate-250 hover:border-slate-350 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all appearance-none cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Action Triggers Grid */}
        <div className="md:col-span-3 flex gap-2 w-full">
          <button
            onClick={() => handleApplyFilters(categoryParam, searchTxt)}
            className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-extrabold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
          
          {(categoryParam !== "All Categories" || keywordParam) && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2.5 border border-slate-200 hover:border-rose-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
              title="Reset configuration filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* Catalog Search Results Section */}
      {loading ? (
        <Loader message="Loading items..." />
      ) : products.length === 0 ? (
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-16 space-y-4" id="empty-catalog-state">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No matching products</h3>
            <p className="text-sm font-medium text-slate-500">We couldn't locate any products matching your selected credentials.</p>
          </div>
          <button
            onClick={clearAllFilters}
            className="inline-flex bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing {products.length} {products.length === 1 ? "Product" : "Products"} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="products-catalog-grid">
            {products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
