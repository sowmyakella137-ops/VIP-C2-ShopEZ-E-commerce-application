import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { ShoppingCart, LogOut, User, Menu, X, LayoutDashboard, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Products", path: "/products" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="shopez-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group" id="navbar-logo-link">
              <span className="bg-emerald-600 text-white p-2 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200/40 transition-all group-hover:scale-105">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span className="text-2xl font-serif font-semibold tracking-tight text-emerald-600 transition-all">
                Shop<span className="font-serif italic font-normal text-emerald-600/90">EZ</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              id="navbar-products-link"
              className={`text-sm font-semibold transition-all px-3 py-2 rounded-lg ${
                isActive("/products")
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
              }`}
            >
              Browse Products
            </Link>

            {/* Admin Dashboard shortcut Link */}
            {isAdmin && (
              <Link
                to="/admin"
                id="navbar-admin-link"
                className={`text-sm font-semibold transition-all flex items-center gap-1.5 px-3 py-2 rounded-lg ${
                  location.pathname.startsWith("/admin")
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Icon & Auth Buttons Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              id="navbar-cart-icon-link"
              className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-emerald-600 transition-all group"
            >
              <ShoppingCart className="w-5.5 h-5.5 transition-transform group-hover:scale-105" />
              {cartCount > 0 && (
                <span
                  id="navbar-cart-badge"
                  className="absolute top-0.5 right-0.5 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce-subtle"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth States */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                <Link
                  to="/profile"
                  id="navbar-profile-btn"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive("/profile")
                      ? "text-emerald-600 bg-emerald-50/80"
                      : "text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
                  }`}
                >
                  <User className="w-4.5 h-4.5 text-slate-400" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  id="navbar-logout-btn"
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
                <Link
                  to="/login"
                  id="navbar-login-btn"
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3.5 py-2 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  id="navbar-register-btn"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="flex items-center md:hidden">
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 mr-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-emerald-600 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 space-y-2 shadow-inner" id="navbar-mobile-menu">
          <Link
            to="/products"
            className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
              isActive("/products") ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Products
          </Link>
          
          {isAdmin && (
            <Link
              to="/admin"
              className={`block px-4 py-3 rounded-xl text-base font-semibold text-indigo-600 bg-indigo-50/60 transition-all`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}

          <div className="border-t border-slate-100 pt-3 mt-3">
            {user ? (
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive("/profile") ? "bg-emerald-50 text-emerald-600" : "text-slate-600 hover:bg-slate-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-slate-400" />
                  My Account: {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                >
                  <LogOut className="w-5 h-5 text-slate-400" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2 pt-2">
                <Link
                  to="/login"
                  className="py-2.5 rounded-xl text-center border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="py-2.5 rounded-xl text-center bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
