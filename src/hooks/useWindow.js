"use client";

import { useEffect, useState } from "react";

export function useWindow() {
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  return { hasWindow, windowObj: hasWindow ? window : null };
}
