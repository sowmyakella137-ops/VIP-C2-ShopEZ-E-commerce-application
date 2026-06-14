import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Mail, Lock, Phone, UserPlus, AlertCircle, ShoppingBag } from "lucide-react";
import Loader from "../components/Loader.jsx";

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password || !phone) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (phone.length < 10) {
      setErrorMsg("Please enter a valid telephone number (at least 10 digits).");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await register(name, email, password, phone);
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        setErrorMsg(result.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to authentication services.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50" id="register-viewport">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 max-w-md w-full p-8 space-y-6" id="register-card">
        
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 p-2.5 rounded-2xl mb-1 border border-emerald-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-sm font-medium text-slate-500">Sign up today and start experiencing fast checkout!</p>
        </div>

        {/* Error Callout Banner */}
        {errorMsg && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-750 text-sm p-3.5 rounded-xl" id="register-error-banner">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Form Body layout */}
        <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700" htmlFor="register-name">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                id="register-name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3 border border-slate-250 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-medium outline-hidden transition-all disabled:opacity-60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700" htmlFor="register-email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                id="register-email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3 border border-slate-250 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-medium outline-hidden transition-all disabled:opacity-60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700" htmlFor="register-phone">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                id="register-phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3 border border-slate-250 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-medium outline-hidden transition-all disabled:opacity-60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700" htmlFor="register-password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                id="register-password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3 border border-slate-250 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-medium outline-hidden transition-all disabled:opacity-60"
                required
              />
            </div>
          </div>

          {/* Form Action Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold py-3 rounded-xl transition-all shadow-md shadow-emerald-50 active:scale-97 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <Loader message="Processing signup..." />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Sign Up
              </>
            )}
          </button>
        </form>

        {/* Footnote link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-extrabold hover:underline" id="register-to-login-link">
              Sign In Instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
