import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import Loader from "./Loader.jsx";

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await api.get("/api/banners");
        if (response.data?.success) {
          setBanners(response.data.banners || []);
        }
      } catch (err) {
        console.error("Error fetching homepage banners", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  // Set up autoplay
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className="h-[280px] md:h-[400px] bg-slate-100 rounded-3xl flex items-center justify-center border border-slate-200">
        <Loader message="Loading promo banners..." />
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative h-[220px] bg-emerald-950 rounded-3xl overflow-hidden p-8 flex flex-col justify-center border border-emerald-900 shadow-md">
        <div className="max-w-md">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
            SHOPPING SPECIAL
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-3 mb-2 leading-tight">Welcome to ShopEZ!</h2>
          <p className="text-emerald-100 text-sm leading-relaxed font-medium">
            Explore authentic products from top categories including Electronics, Apparel, and Athletics. Shop safely and securely!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-slate-900 rounded-3xl overflow-hidden h-[280px] md:h-[420px] group border border-slate-800 shadow-md" id="banner-slider">
      
      {/* Slides Inner Area */}
      <div className="relative w-full h-full">
        {banners.map((slide, index) => {
          const isCurrent = index === currentSlide;
          return (
            <div
              key={slide._id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                isCurrent ? "opacity-100 translate-x-0 scale-100 z-10" : "opacity-0 translate-x-12 scale-98 z-0 pointer-events-none"
              }`}
            >
              {/* Backing image layer with dark gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/45 to-transparent z-1 bg-cover bg-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center translate-all duration-1000"
                />
              </div>

              {/* Slate Text overlay content */}
              <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center p-8 md:p-16 max-w-2xl bg-gradient-to-r from-black/60 to-transparent">
                <span className="bg-emerald-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full w-max uppercase tracking-wider mb-4 shadow-sm shadow-emerald-900">
                  Exclusive Offer
                </span>
                <h2 className="text-2xl md:text-4.5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
                  {slide.title}
                </h2>
                
                {slide.link && (
                  <Link
                    to={slide.link}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-97 text-white text-sm font-extrabold px-6 py-3 rounded-xl w-max transition-all shadow-md shadow-emerald-900 cursor-pointer"
                  >
                    Shop Collection Now
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Navigation controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 p-2.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm border border-white/20"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5.5 h-5.5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-slate-900 p-2.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm border border-white/20"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5.5 h-5.5" />
          </button>

          {/* Dots Indicators panel */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-25">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlide ? "w-6 h-2 bg-emerald-500" : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

    </div>
  );
}
