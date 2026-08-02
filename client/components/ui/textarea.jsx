"use client";

import React from "react";

const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full border p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${className}`}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
