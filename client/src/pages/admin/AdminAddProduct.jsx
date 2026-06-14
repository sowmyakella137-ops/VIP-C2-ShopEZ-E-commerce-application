import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { ArrowLeft, Save, Plus, HelpCircle, AlertCircle, Sparkles } from "lucide-react";

const CATEGORIES = [
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

// Fallback high-resolution Unsplash product image URLs
const PRESET_IMAGES = [
  { label: "Sleek Electronics", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" },
  { label: "Fashion Apparel", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop" },
  { label: "Home Utensils", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop" },
  { label: "Athletic Shoes", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" }
];

export default function AdminAddProduct() {
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !description || price === undefined || !brand || stock === undefined) {
      setErrorMsg("Please fill out all required parameters.");
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      setErrorMsg("Price and Stock indicators must contain non-negative numbers.");
      return;
    }

    if (discountPrice && Number(discountPrice) >= Number(price)) {
      setErrorMsg("Action Failed: Discount price must be strictly less than the original listing price.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Auto assign fallback Unsplash image if blank
      const finalImage = imageUrl.trim() || PRESET_IMAGES[0].url;

      const payload = {
        name,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        category,
        brand,
        stock: Number(stock),
        images: [{ url: finalImage }],
        isFeatured
      };

      const response = await api.post("/api/admin/products", payload);
      if (response.data?.success) {
        alert("Product registered in catalog successfully!");
        navigate("/admin/products");
      } else {
        setErrorMsg(response.data?.message || "Failed to create catalog entry.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong sending data to servers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" id="admin-add-product-page">
      
      {/* Upper header */}
      <div className="space-y-1.5">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-440 hover:text-indigo-650 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory Catalog
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-slate-909 tracking-tight flex items-center gap-2">
          <Plus className="w-7 h-7 text-indigo-650 stroke-[3]" />
          Create Catalog Entry
        </h1>
        <p className="text-sm font-semibold text-slate-404">Add a brand new physical item profile to ShopEZ customer catalogs.</p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-250 text-rose-700 text-sm p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Main split form segment layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="admin-add-product-form">
        
        {/* Left Column: Core Description fields */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2.5">
            1. Core Properties
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="add-p-name">Product Name</label>
              <input
                id="add-p-name"
                type="text"
                placeholder="Wireless Noise-Canceling Headphones, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="add-p-desc">Deep Description</label>
              <textarea
                id="add-p-desc"
                rows={5}
                placeholder="Describe product highlights, technical properties, weights, build properties, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-4 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-700"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-505 uppercase tracking-wider" htmlFor="add-p-brand">Brand Title</label>
                <input
                  id="add-p-brand"
                  type="text"
                  placeholder="Sony, Nike, Penguin..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-505 uppercase tracking-wider" htmlFor="add-p-cat">Product Category</label>
                <select
                  id="add-p-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-505 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 cursor-pointer"
                >
                  {CATEGORIES.map((catString) => (
                    <option key={catString} value={catString}>
                      {catString}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Inventory limits, Images config */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 2: Financial pricing & stocks */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              2. Catalog Auditing
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="add-p-price">Retail Price (₹)</label>
                <input
                  id="add-p-price"
                  type="number"
                  placeholder="Maximum Retail Price ₹"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-bold outline-hidden transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="add-p-discprice">Discounted Offer Price (₹) <span className="text-[10px] text-slate-404 font-semibold">(optional)</span></label>
                <input
                  id="add-p-discprice"
                  type="number"
                  placeholder="Selling price if on sale ₹"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-bold outline-hidden transition-all disabled:opacity-60 text-rose-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="add-p-stock">Starting Inventory Stock</label>
                <input
                  id="add-p-stock"
                  type="number"
                  placeholder="Total units available"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-bold outline-hidden transition-all disabled:opacity-60"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Imagery presets */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2.5">
              3. Visual Asset URL
            </h3>

            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="add-p-image">Primary Image URL</label>
                <input
                  id="add-p-image"
                  type="url"
                  placeholder="https://images.unsplash.com/your-image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-xs font-medium outline-hidden transition-all disabled:opacity-60"
                />
              </div>

              {/* Presets help buttons */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Preset helpers</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      disabled={isSubmitting}
                      className="text-[10px] font-bold bg-slate-100 dark:hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 px-2 py-1 rounded transition-all cursor-pointer"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Special configs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                disabled={isSubmitting}
                className="mt-1 h-4.5 w-4.5 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <div className="space-y-0.5 select-none text-xs">
                <p className="font-extrabold text-slate-850 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Mark as Featured Product
                </p>
                <p className="font-semibold text-slate-400 leading-normal">Checking this exposes the product item to the prime slider rows of the homepage.</p>
              </div>
            </label>
          </div>

          {/* Action trigger button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-indigo-50 active:scale-97 cursor-pointer flex items-center justify-center gap-1.5 transition-all text-sm"
          >
            {isSubmitting ? <Loader message="Creating product profile..." /> : (
              <>
                <Save className="w-4.5 h-4.5" />
                Publish Product Profile
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
}
