import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Mail, Lock, LogIn, AlertCircle, ShoppingBag } from "lucide-react";
import Loader from "../components/Loader.jsx";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from?.pathname || "/";


  useEffect(() => {
    if (user) {
      navigate(fromPath, { replace: true });
    }
  }, [user, navigate, fromPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await login(email, password);
      if (result.success) {
       
      } else {
        setErrorMsg(result.message || "Invalid credentials.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to authentication services.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50" id="login-viewport">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 max-w-md w-full p-8 space-y-6" id="login-card">
        
        {/* Card Header branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 p-2.5 rounded-2xl mb-1 border border-emerald-100">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to ShopEZ</h2>
          <p className="text-sm font-medium text-slate-500">Welcome back! Access your shopping cart & track orders.</p>
        </div>

       
        {errorMsg && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 text-rose-750 text-sm p-3.5 rounded-xl" id="login-error-banner">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Form Body layout */}
        <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700" htmlFor="login-email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3 border border-slate-250 focus:border-emerald-500 bg-slate-50 focus:bg-white rounded-xl text-sm font-medium outline-hidden transition-all disabled:opacity-60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700" htmlFor="login-password">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                id="login-password"
                type="password"
                placeholder="Enter password"
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
              <Loader message="Signing in..." />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footnote Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm font-medium text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-extrabold hover:underline" id="login-to-register-link">
              Create an Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
