import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";
import { User, Phone, MapPin, Lock, Save, ShieldAlert, CheckCircle, Smartphone } from "lucide-react";

export default function ProfilePage() {
  const { user, updateLocalUser } = useAuth();

  // Basic Info States
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Address States
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Password States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status indicators
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Sync state on load
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      if (user.address) {
        setStreet(user.address.street || "");
        setCity(user.address.city || "");
        setState(user.address.state || "");
        setPincode(user.address.pincode || "");
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Password verification logic if provided
    if (password) {
      if (password.length < 6) {
        setErrorMsg("Your secure password must be at least 6 characters in size.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Your passwords do not match. Please verify.");
        return;
      }
    }

    try {
      setIsUpdating(true);
      const payload = {
        name,
        phone,
        address: { street, city, state, pincode }
      };

      if (password) {
        payload.password = password;
      }

      const response = await api.put("/api/users/profile", payload);
      if (response.data?.success && response.data?.user) {
        // Sync context so the navbar and rest of the app gets the updated name
        updateLocalUser(response.data.user);
        setSuccessMsg("Your customer profile has been updated and synchronized!");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(response.data?.message || "Failed to edit user values.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong saving your details.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return <Loader message="Accessing account..." />;

  return (
    <div className="space-y-8" id="profile-page">
      
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-slate-905 tracking-tight flex items-center gap-2">
          <User className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
          My Profile settings
        </h1>
        <p className="text-sm font-semibold text-slate-404">Review address configs, personal settings, and passwords.</p>
      </div>

      {/* Banner message panels */}
      {successMsg && (
        <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-250 text-emerald-800 text-sm p-4 rounded-xl" id="profile-success-banner">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <span className="font-extrabold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-sm p-4 rounded-xl" id="profile-error-banner">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <span className="font-extrabold">{errorMsg}</span>
        </div>
      )}

      {/* Split Profile dashboard layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="profile-form">
        
        {/* Left Column: Account Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Personal Attributes */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 tracking-tight flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-emerald-650" />
              General Account Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="profile-name">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="profile-email">Email Address <span className="text-[10px] text-slate-400 font-medium">(read-only)</span></label>
                <input
                  id="profile-email"
                  type="email"
                  value={user.email}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-100 text-slate-500 rounded-xl text-sm font-semibold outline-hidden cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="profile-phone">Phone Number</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Role</label>
                <div className={`px-4 py-2.5 border rounded-xl text-xs font-black uppercase tracking-wider ${user.isAdmin ? "border-indigo-150 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-slate-100 text-slate-500"}`}>
                  {user.isAdmin ? "♛ Technical Administrator" : "Verified Customer"}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Coordinates */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-5">
            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-650" />
              Default Address configs
            </h2>

            <div className="grid grid-cols-1 gap-4.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="profile-street">Street Address</label>
                <input
                  id="profile-street"
                  type="text"
                  placeholder="Apartment, Studio, Street Details"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="profile-city">City</label>
                  <input
                    id="profile-city"
                    type="text"
                    placeholder="E.g. Bangalore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="profile-state">State</label>
                  <input
                    id="profile-state"
                    type="text"
                    placeholder="E.g. Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="profile-pin">Pincode</label>
                  <input
                    id="profile-pin"
                    type="text"
                    placeholder="E.g. 560001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    disabled={isUpdating}
                    className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Password security locks */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-black text-slate-905 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" />
              Credentials Locker
            </h3>
            
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              If you wish to modify your current password, fill out the parameters below. Leave empty to keep present configurations.
            </p>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-520 uppercase tracking-wider" htmlFor="profile-new-pass">New Password</label>
                <input
                  id="profile-new-pass"
                  type="password"
                  placeholder="6 characters or more"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-520 uppercase tracking-wider" htmlFor="profile-conf-pass">Confirm Password</label>
                <input
                  id="profile-conf-pass"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl focus:border-emerald-500 text-sm font-semibold outline-hidden transition-all disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* Settings Save Trigger */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-extrabold py-3.5 rounded-2xl shadow-md shadow-emerald-50 active:scale-97 cursor-pointer flex items-center justify-center gap-2 transition-all text-sm"
          >
            {isUpdating ? <Loader message="Saving changes..." /> : (
              <>
                <Save className="w-4.5 h-4.5" />
                Synchronize Profile Details
              </>
            )}
          </button>

        </div>

      </form>

    </div>
  );
}
