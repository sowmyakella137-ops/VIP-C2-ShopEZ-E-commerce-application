import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { ArrowLeft, Save, Pencil, HelpCircle, AlertCircle, Sparkles } from "lucide-react";

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

const PRESET_IMAGES = [
  { label: "Sleek Electronics", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop" },
  { label: "Fashion Apparel", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop" },
  { label: "Home Utensils", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600&auto=format&fit=crop" },
  { label: "Athletic Shoes", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop" }
];

export default function AdminEditProduct() {
  const { id } = useParams();
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

  // States
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load product to edit
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await api.get(`/api/products/${id}`);
        if (response.data?.success && response.data?.product) {
          const p = response.data.product;
          setName(p.name || "");
          setDescription(p.description || "");
          setPrice(p.price || "");
          setDiscountPrice(p.discountPrice || "");
          setCategory(p.category || "Electronics");
          setBrand(p.brand || "");
          setStock(p.stock || "");
          setImageUrl(p.images?.[0]?.url || "");
          setIsFeatured(!!p.isFeatured);
        } else {
          setErrorMsg("Could not fetch product information.");
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !description || price === undefined || !brand || stock === undefined) {
      setErrorMsg("Please fill out all required fields.");
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
      
      const payload = {
        name,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        category,
        brand,
        stock: Number(stock),
        images: [{ url: imageUrl }],
        isFeatured
      };

      const response = await api.put(`/api/admin/products/${id}`, payload);
      if (response.data?.success) {
        alert("Product updated in catalog successfully!");
        navigate("/admin/products");
      } else {
        setErrorMsg(response.data?.message || "Failed to update catalog entry.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error communicating with update server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader fullPage={true} message="Prepopulating product fields..." />;

  return (
    <div className="space-y-8" id="admin-edit-product-page">
      
      {/* Upper header */}
      <div className="space-y-1.5">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-440 hover:text-indigo-650 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Inventory Catalog
        </Link>
        <h1 className="text-2xl md:text-3xl font-black text-slate-909 tracking-tight flex items-center gap-2">
          <Pencil className="w-7 h-7 text-indigo-650" />
          Edit Catalog Entry
        </h1>
        <p className="text-sm font-semibold text-slate-404">Update physical properties, pricing layouts, or slider features of the catalog entry.</p>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 bg-rose-50 border border-rose-250 text-rose-700 text-sm p-4 rounded-xl max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Main split form segment layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="admin-edit-product-form">
        
        {/* Left Column: Core Description fields */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2.5">
            1. Core Properties
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="edit-p-name">Product Name</label>
              <input
                id="edit-p-name"
                type="text"
                placeholder="Product title"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="edit-p-desc">Deep Description</label>
              <textarea
                id="edit-p-desc"
                rows={5}
                placeholder="Highlight physical values..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-4 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-705"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-505 uppercase tracking-wider" htmlFor="edit-p-brand">Brand Title</label>
                <input
                  id="edit-p-brand"
                  type="text"
                  placeholder="Sony, Nike, etc..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-850"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-505 uppercase tracking-wider" htmlFor="edit-p-cat">Product Category</label>
                <select
                  id="edit-p-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-505 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 cursor-pointer text-slate-800"
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="edit-p-price">Retail Price (₹)</label>
                <input
                  id="edit-p-price"
                  type="number"
                  placeholder="MRP ₹"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-bold outline-hidden transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="edit-p-discprice">Discounted Offer Price (₹)</label>
                <input
                  id="edit-p-discprice"
                  type="number"
                  placeholder="Selling price if on sale ₹"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-sm font-bold outline-hidden transition-all disabled:opacity-60 text-rose-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="edit-p-stock">Adjust Inventory Stock</label>
                <input
                  id="edit-p-stock"
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
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="edit-p-image">Primary Image URL</label>
                <input
                  id="edit-p-image"
                  type="url"
                  placeholder="Image URL link"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-500 text-xs font-medium outline-hidden transition-all disabled:opacity-60"
                />
              </div>

              {/* Presets help buttons */}
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-404 uppercase tracking-wider">Preset helpers</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      disabled={isSubmitting}
                      className="text-[10px] font-bold bg-slate-100 dark:hover:bg-indigo-50 border border-slate-205 hover:border-indigo-200 hover:text-indigo-600 px-2 py-1 rounded transition-all cursor-pointer"
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
                <p className="font-semibold text-slate-400 leading-normal">Exposes product to prime homepage sliders.</p>
              </div>
            </label>
          </div>

          {/* Action trigger button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-705 text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-indigo-50 active:scale-97 cursor-pointer flex items-center justify-center gap-1.5 transition-all text-sm"
          >
            {isSubmitting ? <Loader message="Saving changes..." /> : (
              <>
                <Save className="w-4.5 h-4.5" />
                Update Product Profile
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
}
