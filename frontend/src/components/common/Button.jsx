import React from "react";
import { Link } from "react-router-dom";

export default function Button({ to, children, className = "", variant = "primary", onClick, type = "button", disabled = false }) {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95";
  const size = "w-full sm:w-auto px-6 py-3 text-base";

  const variants = {
    primary: "bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-800 hover:to-blue-900 shadow-lg shadow-blue-700/30 hover:shadow-xl hover:shadow-blue-700/40 focus:ring-blue-700",
    secondary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 focus:ring-orange-500",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 focus:ring-emerald-500",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 focus:ring-red-500",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100/80 border-2 border-gray-300 hover:border-gray-400 focus:ring-gray-500",
    outline: "bg-white/80 backdrop-blur-sm text-blue-700 border-2 border-blue-700 hover:bg-blue-50 hover:border-blue-800 focus:ring-blue-700",
  };

  const classes = `${base} ${size} ${variants[variant] || variants.primary} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
