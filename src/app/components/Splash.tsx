
"use client";

import { useEffect, useState } from "react";

export default function Splash() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the splash screen after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Hide the splash screen with fade-out animation
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-600 text-white">
      {/* Logo or App Name */}
      <div className="flex flex-col items-center animate-fade">
        <div className="text-4xl font-bold mb-4">مفقود</div>
        {/* Loading Spinner */}
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
