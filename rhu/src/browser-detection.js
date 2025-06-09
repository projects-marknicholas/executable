import { useEffect } from "react";

const InAppBrowserDetector = () => {
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // List of in-app browsers
    const isInAppBrowser = /FBAN|FBAV|Instagram|Line|MicroMessenger|QQBrowser|TikTok/i.test(userAgent);
    const url = window.location.href;

    if (isInAppBrowser) {
      alert("Redirecting to an external browser for the best experience.");
      
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        // iOS: Use Safari
        window.location.href = `googlechrome://${url.replace(/^https?:\/\//, "")}`;
      } else if (/Android/i.test(userAgent)) {
        // Android: Open in Chrome via intent
        window.location.href = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;end;`;
      } else {
        // Fallback: Force reload (may open in default browser)
        window.location.assign(url);
      }
    }
  }, []);

  return null;
};

export default InAppBrowserDetector;
