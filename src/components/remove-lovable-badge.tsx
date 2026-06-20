'use client';

import { useEffect } from 'react';

export function RemoveLovableBadge() {
  useEffect(() => {
    // Remove Lovable badge if present
    const badge = document.getElementById('lovable-badge');
    if (badge) {
      badge.remove();
    }
  }, []);

  return null;
}
