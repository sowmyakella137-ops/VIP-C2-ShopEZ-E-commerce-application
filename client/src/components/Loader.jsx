import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ fullPage = false, message = "Loading..." }) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3 text-emerald-600">
      <Loader2 className="w-10 h-10 animate-spin stroke-[2.5]" id="loader-spinner-icon" />
      {message && <p className="text-sm font-medium tracking-wide text-slate-500">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/85 z-50 flex items-center justify-center backdrop-blur-xs" id="fullpage-loader-container">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full" id="inline-loader-container">
      {content}
    </div>
  );
}
