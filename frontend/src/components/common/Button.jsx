import React from "react";
import { Link } from "react-router-dom";

export default function Button({ to, children, className = "", variant = "primary", onClick, type = "button" }) {
  const base = "inline-flex items-center justify-center rounded-lg font-semibold transition focus:outline-none";
  const size = "w-full sm:w-auto px-4 py-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-transparent text-gray-800 hover:bg-gray-100 border",
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
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
