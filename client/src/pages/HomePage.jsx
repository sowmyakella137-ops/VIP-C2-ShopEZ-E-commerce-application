import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios.js";
import BannerSlider from "../components/BannerSlider.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import {
  Search,
  Laptop,
  Shirt,
  BookOpen,
  Apple,
  ChefHat,
  Heart,
  Gamepad2,
  Sparkles,
  MoreHorizontal,
  ChevronRight,
  TrendingUp
} from "lucide-react";

const CATEGORIES = [
  { name: "Electronics", icon: Laptop, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "Clothing", icon: Shirt, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "Books", icon: BookOpen, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Groceries", icon: Apple, color: "bg-red-50 text-red-600 border-red-100" },
  { name: "Home & Kitchen", icon: ChefHat, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { name: "Sports", icon: Heart, color: "bg-orange-50 text-orange-600 border-orange-100" },
  { name: "Toys", icon: Gamepad2, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { name: "Beauty", icon: Sparkles, color: "bg-pink-50 text-pink-600 border-pink-100" },
  { name: "Other", icon: MoreHorizontal, color: "bg-slate-50 text-slate-600 border-slate-100" }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await api.get("/api/products/featured");
        if (response.data?.success) {
          setFeaturedProducts(response.data.products || []);
        }
      } catch (err) {
        console.error("Error loading featured products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <div className="space-y-12" id="shopez-homepage">
      
      {/* Search Input Box Area */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-serif font-light text-slate-900 tracking-tight leading-tight">
            Curated Living with <span className="italic text-emerald-600 font-semibold font-serif">ShopEZ</span>
          </h1>
          <p className="text-sm font-semibold text-slate-500">Discover and procure authentic organic goods instantly.</p>
        </div>

        <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md flex gap-2" id="homepage-search-form">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for products, brands or details..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-250 hover:border-slate-350 focus:border-emerald-500 focus:bg-white rounded-2xl text-sm font-semibold outline-hidden transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-2xl transition-all shadow-md shadow-emerald-50 active:scale-97 cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Banner Promotions Slider Section */}
      <section id="marketing-slider-section">
        <BannerSlider />
      </section>

      {/* Categories Bento Grid Section */}
      <section className="space-y-6" id="categories-section">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2.5xl font-serif font-light text-slate-900 tracking-tight">Explore <span className="italic font-serif font-normal">Categories</span></h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">Choose from top high-demand catalog classes.</p>
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white border border-slate-150 hover:border-emerald-200 hover:shadow-md hover:shadow-slate-100 rounded-2xl group transition-all cursor-pointer"
                id={`cat-btn-${cat.name.replace(/\s+/g, "-")}`}
              >
                <div className={`p-3 rounded-xl border mb-3 group-hover:scale-105 transition-transform ${cat.color}`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-[11px] sm:text-xs font-extrabold text-slate-800 tracking-tight text-center truncate w-full">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="space-y-6" id="featured-products-section">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600">
              <TrendingUp className="w-4.5 h-4.5 stroke-[2.5]" />
              <span className="text-[11px] font-black uppercase tracking-wider">Meticulously Curated</span>
            </div>
            <h2 className="text-xl md:text-2.5xl font-serif font-light text-slate-900 tracking-tight">Featured <span className="italic font-serif font-normal">Products</span></h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-404">Exclusive curation of finest customer-favorite picks.</p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline hover:gap-1.5 transition-all"
            id="featured-see-all-link"
          >
            See All Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader message="Fetching featured products..." />
        ) : featuredProducts.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium">No featured products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
