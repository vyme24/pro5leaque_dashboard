"use client";

import { useEffect, useState } from "react";

/**
 * Load Acquired SDK dynamically
 * @param {string} version - SDK version (e.g., "v1.2")
 */
export function useAcquired(version = "v1.2") {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    // Avoid loading multiple times
    if (window.Acquired) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://cdn.acquired.com/sdk/${version}/acquired.js`;
    script.crossOrigin = "anonymous";

    // Integrity hash per version
    const integrityMap = {
      "v1": "sha384-+p2Thm18WpWX46t6BW9NWwl1xu/GnwWwwBm1omxkZAkGJ0ALwxOWO0yTUnfiHcok",
      "v1.1": "sha384-uEWrid7+SjZbfDvQmobDdKO/2ofqACn5KXS9DKANcM0UfHIq+6X1ItKH+dBqcsaV",
      "v1.2": "sha384-bgUUOyfGGHexQhNxBxCYD4CIK0K+Lz75YXJ8wmYrYS9+nso5lyrWIHNPqFOUG/Vd",
    };
    script.integrity = integrityMap[version] || "";
    script.onload = () => setReady(true);
    script.onerror = () => console.error("Failed to load Acquired SDK");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [version]);

  return ready;
}
