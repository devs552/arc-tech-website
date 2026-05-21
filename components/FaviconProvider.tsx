'use client';

import { useEffect } from 'react';

export default function FaviconProvider() {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        console.log('FaviconProvider: Checking for favicon updates...');
        
        // Fetch from the API route to get fresh favicon
        const res = await fetch('/favicon.ico', { 
          cache: 'no-store',
        });

        if (res.ok) {
          // The favicon route will redirect to the actual favicon
          console.log('FaviconProvider: Favicon updated from API route');
          
          // Force refresh the favicon link
          const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (link) {
            // Add cache busting param
            link.href = '/favicon.ico?t=' + Date.now();
          }
        }
      } catch (error) {
        console.error('FaviconProvider: Error updating favicon:', error);
      }
    };

    // Check immediately
    updateFavicon();
    
    // Check every 60 seconds for changes
    const interval = setInterval(updateFavicon, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return null;
}
