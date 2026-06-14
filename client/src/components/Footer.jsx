import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900" id="shopez-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white p-1.5 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </span>
              <span className="text-xl font-serif font-bold tracking-tight text-white">
                Shop<span className="font-serif italic font-normal text-emerald-500">EZ</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Your one-stop destination for premium electronics, fashionable apparel, and elegant lifestyle goods. Bringing quality right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Shopping</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-white transition-all flex items-center gap-1 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500" />
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-white transition-all flex items-center gap-1 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500" />
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Clothing" className="hover:text-white transition-all flex items-center gap-1 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500" />
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/products?category=Sports" className="hover:text-white transition-all flex items-center gap-1 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500" />
                  Footwear & Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Policies */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Customer Help</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profile" className="hover:text-white transition-all flex items-center gap-1 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500" />
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-all flex items-center gap-1 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500" />
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-all flex items-center gap-1 group">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-500" />
                  My Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>ShopEZ  Tech Park, Block:72, Varma Housing, Tilak Nagar, Hyderabad</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>+91 72727 27272</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                <span>support@shopez.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider Footer */}
        <div className="border-t border-slate-905 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© {currentYear} ShopEZ.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
