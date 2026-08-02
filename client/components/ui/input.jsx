"use client";

import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full border p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${className}`}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
