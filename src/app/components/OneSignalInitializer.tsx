'use client';

import { useEffect } from 'react';

// Extend the window type to declare OneSignalDeferred
declare global {
  interface Window {
    OneSignalDeferred?: ((OneSignal: any) => void)[];
  }
}

export default function OneSignalInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure OneSignalDeferred exists
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal) => {
        await OneSignal.init({
          appId: 'a20918ee-ab25-4dbd-951e-6bf0763799dd', 
        //   safari_web_id: 'your-safari-web-id', // Optional: for Safari push notifications
          notifyButton: {
            enable: true, // Enable the bell icon
          },
        });
      });
    }
  }, []);

  return null;
}
