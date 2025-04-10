import React from "react";

export const Button = ({ children, onClick, type = "button", variant = "default", className = "" }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition duration-300";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
