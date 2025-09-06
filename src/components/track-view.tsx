'use client';

import { useEffect } from 'react';

export function TrackView({ productId }: { productId: string }) {
  useEffect(() => {
    try {
      const browsingHistoryJSON = localStorage.getItem('browsingHistory');
      let browsingHistory: string[] = browsingHistoryJSON ? JSON.parse(browsingHistoryJSON) : [];
      
      // Remove if already exists to move it to the end
      browsingHistory = browsingHistory.filter(id => id !== productId);
      browsingHistory.push(productId);
      
      // Keep only the last 10 viewed products
      if (browsingHistory.length > 10) {
        browsingHistory.shift();
      }
      
      localStorage.setItem('browsingHistory', JSON.stringify(browsingHistory));
    } catch (error) {
      console.error("Failed to update browsing history in localStorage", error);
    }
  }, [productId]);

  return null;
}
