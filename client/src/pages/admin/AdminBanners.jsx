import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import Loader from "../../components/Loader.jsx";
import { Image as ImageIcon, ArrowLeft, Plus, Trash2, RefreshCw, AlertCircle, Sparkles, CheckCircle } from "lucide-react";

const PRESET_BANNERS = [
  { label: "Electronics Gala Promo", url: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=1200&auto=format&fit=crop" },
  { label: "Summer Outfitters Clearance", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop" },
  { label: "Reading Festival Discount", url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop" }
];

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form Inputs
  const [imageUrl, setImageUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const response = await api.get("/api/banners");
      if (response.data?.success) {
        setBanners(response.data.banners || []);
      } else {
        setErrorMsg("Failed to gather promotional campaigns.");
      }
    } catch (err) {
      setErrorMsg("Error communicating with campaign servers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!imageUrl.trim()) {
      setErrorMsg("Please provide a valid banner image URL.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/api/admin/banners", {
        imageUrl,
        label: label.trim() || "Promotional Deal"
      });

      if (response.data?.success) {
        setSuccessMsg("Banner added to slider carousel successfully!");
        setImageUrl("");
        setLabel("");
        fetchBanners();
        setTimeout(() => setSuccessMsg(""), 3500);
      } else {
        setErrorMsg(response.data?.message || "Failed to add banner.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error communicating with server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this promotional banner?")) {
      try {
        const response = await api.delete(`/api/admin/banners/${bannerId}`);
        if (response.data?.success) {
          setSuccessMsg("Banner purged successfully!");
          fetchBanners();
          setTimeout(() => setSuccessMsg(""), 3500);
        } else {
          setErrorMsg(response.data?.message || "Failed to remove banner.");
        }
      } catch (err) {
        setErrorMsg("Something went wrong deleting the banner.");
      }
    }
  };

  if (loading && banners.length === 0) return <Loader fullPage={true} message="Assembling active campaign sliders..." />;

  return (
    <div className="space-y-8" id="admin-banners-page">
      
      {/* Header */}
      <div className="space-y-1.5">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-650 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Executive Dashboard
        </Link>
        <h1 className="text-2xl md:text-3.5xl font-serif font-light text-slate-900 tracking-tight flex items-center gap-2">
          <ImageIcon className="w-7 h-7 text-indigo-600" />
          Promo Slider <span className="font-serif italic font-normal text-emerald-600">Campaigns</span>
        </h1>
        <p className="text-sm font-semibold text-slate-400">Promote high-demand categories via striking slider carousels.</p>
      </div>

      {successMsg && (
        <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-250 text-emerald-805 text-sm p-4 rounded-xl">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span className="font-extrabold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-805 text-sm p-4 rounded-xl mt-4">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-extrabold">{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Active Slider list Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="admin-banners-grid">
        
        {/* Left Column: Register forms properties */}
        <form onSubmit={handleCreate} className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-5" id="add-banner-form">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
            <Plus className="w-4.5 h-4.5" />
            Append Slider Campaign
          </h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="banner-alt">Campaign Description Label</label>
              <input
                id="banner-alt"
                type="text"
                placeholder="E.g. Festival Season discounts, Summer Clearance"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-505 text-sm font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-800"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 uppercase tracking-wider" htmlFor="banner-img">Banner Image URL</label>
              <input
                id="banner-img"
                type="url"
                placeholder="https://images.unsplash.com/promo-banner"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-indigo-505 text-xs font-semibold outline-hidden transition-all disabled:opacity-60 text-slate-800"
                required
              />
            </div>

            {/* Presets */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-404 uppercase tracking-wider">Presets helpers</p>
              <div className="flex flex-col gap-1.5">
                {PRESET_BANNERS.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setLabel(preset.label);
                    }}
                    disabled={isSubmitting}
                    className="text-[10px] font-bold text-left bg-slate-100 border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 px-3 py-1.5 rounded-lg transition-all cursor-pointer truncate"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-extrabold py-3 rounded-xl shadow-md shadow-indigo-50 active:scale-97 cursor-pointer flex items-center justify-center gap-1.5 transition-all text-xs"
            >
              {isSubmitting ? <Loader message="Saving..." /> : (
                <>
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Add to Active Carousel
                </>
              )}
            </button>

          </div>
        </form>

        {/* Right Column: Live List with mini thumbnails */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 space-y-6" id="banners-collection-container">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Listing {banners.length} Active Slides
            </h2>
            <button
              onClick={fetchBanners}
              className="text-xs font-black text-indigo-600 hover:text-indigo-755 inline-flex items-center gap-1"
              title="Force reload index"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Index
            </button>
          </div>

          {banners.length === 0 ? (
            <div className="bg-slate-50 border border-slate-150 p-12 rounded-2xl text-center text-slate-400 font-semibold text-sm">
              No promotional campaigns configured in current catalog sliders.
            </div>
          ) : (
            <div className="space-y-4" id="active-campaigns-list">
              {banners.map((slide) => (
                <div key={slide._id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-slate-50">
                  <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0">
                    <img
                      src={slide.imageUrl}
                      alt={slide.label}
                      referrerPolicy="no-referrer"
                      className="w-20 sm:w-32 h-14 object-cover rounded-xl border bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-905 truncate" title={slide.label}>
                        {slide.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono select-all truncate uppercase tracking-tight mt-0.5">
                        ID: {slide._id}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="p-2 border border-transparent hover:border-rose-150 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all inline-flex items-center justify-center shrink-0 cursor-pointer self-end sm:self-auto"
                    title="Purge promo slide"
                    id={`del-ban-${slide._id}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
