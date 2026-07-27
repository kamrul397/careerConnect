"use client";

import React from "react";

const Textarea = React.forwardRef((props, ref) => {
  return (
    <textarea
      ref={ref}
      className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;
