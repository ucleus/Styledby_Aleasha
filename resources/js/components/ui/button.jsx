import * as React from "react";

export function Button({
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  children,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700",
    outline: "border border-gray-300 hover:bg-gray-100 hover:text-gray-900",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    link: "text-purple-600 underline-offset-4 hover:underline",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
  };
  
  const variantStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.default;
  const allStyles = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`;
  
  return (
    <button 
      className={allStyles} 
      disabled={disabled} 
      {...props}
    >
      {children}
    </button>
  );
}