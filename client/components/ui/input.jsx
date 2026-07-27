"use client";

import React from "react";

const Input = React.forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
