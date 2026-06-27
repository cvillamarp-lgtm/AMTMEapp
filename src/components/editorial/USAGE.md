# Editorial Components - Usage Guide

All components have been extracted from the monolithic `landing-editorial.tsx` into modular, reusable React components for Next.js 15.

## Components Overview

### 1. **EditorialHeader**
- Sticky header with navigation, logo, and mobile menu
- Uses state for mobile menu toggle
- Includes scroll-to-section functionality
- Already existed in the directory

### 2. **EditorialHero**
- Hero section with main title, subtitle, call-to-action buttons
- Stats display (Temporadas, Episodios, Oyentes)
- Featured image with host badge
- Animated marquee with topics
- **Props:**
  - `onListenClick?: () => void` - Featured episode button handler
  - `onEpisodesClick?: () => void` - View episodes button handler

### 3. **EditorialFeaturedEpisode**
- Featured episode showcase with dark background
- Spotify embed integration using `BRAND.spotifyEmbedUrl`
- Platform links (Spotify, Apple Podcasts, YouTube, iVoox)
- Full episode details and description

### 4. **EditorialAboutSection**
- "Qué es AMTME" section with manifesto text
- Explains the podcast's purpose and philosophy
- Light cream background with highlighted text

### 5. **EditorialTopicsGrid**
- Grid of 9 emotional topics covered in the podcast
- Numbered tags (01-09)
- Hover state styling
- Hardcoded topic list (ready for props adaptation)

### 6. **EditorialRecentEpisodes**
- Grid of 3 most recent episodes
- Episode cards with images, tags, duration, description
- Hover animations (scale up on image)
- "See all episodes" link
- Hardcoded data (ready for dynamic adaptation)

### 7. **EditorialManifesto**
- Navy background section with manifesto text
- Large typography with highlighted key phrase
- Call-to-action buttons
- **Props:**
  - `onListenClick?: () => void`
  - `onNewsletterClick?: () => void`

### 8. **EditorialAboutChristian**
- About Christian section with reordered layout (mobile-first)
- Christian's image and biography
- Links to Instagram and "Learn more"
- Hover state on buttons

### 9. **EditorialNewsletter**
- Newsletter signup form with lime background
- Email input with validation
- Testimonial quote section (desktop only)
- **Props:**
  - `onSubmit?: (email: string) => void | Promise<void>` - Email submission handler

### 10. **EditorialPlatforms**
- Platform links section showing where to listen
- Uses `BRAND` constants for URLs
- 4-column responsive grid

### 11. **EditorialFooter**
- Complete footer with navigation, links, contact info
- Four-column layout with brand, navigation, streaming, and contact
- Scroll-to-section buttons for internal navigation
- **Props:**
  - `onScrollToSection?: (sectionId: string) => void`

## Integration Example

```tsx
'use client';

import { useState } from 'react';
import {
  EditorialHeader,
  EditorialHero,
  EditorialFeaturedEpisode,
  EditorialAboutSection,
  EditorialTopicsGrid,
  EditorialRecentEpisodes,
  EditorialManifesto,
  EditorialAboutChristian,
  EditorialNewsletter,
  EditorialPlatforms,
  EditorialFooter,
} from '@/components/editorial';

export default function LandingEditorialPage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f2ea', color: '#0c1f36' }}>
      <EditorialHeader />

      <main>
        <EditorialHero
          onListenClick={() => scrollToSection('featured')}
          onEpisodesClick={() => scrollToSection('episodios')}
        />

        <EditorialFeaturedEpisode />

        <EditorialAboutSection />

        <EditorialTopicsGrid />

        <EditorialRecentEpisodes />

        <EditorialManifesto
          onListenClick={() => scrollToSection('featured')}
          onNewsletterClick={() => scrollToSection('newsletter')}
        />

        <EditorialAboutChristian />

        <EditorialNewsletter
          onSubmit={async (email) => {
            // Handle newsletter submission
            console.log('Subscribe:', email);
          }}
        />

        <EditorialPlatforms />
      </main>

      <EditorialFooter onScrollToSection={scrollToSection} />
    </div>
  );
}
```

## Styling Notes

All components use **inline styles** to maintain the original design:
- **Navy**: `#0c1f36`
- **Lime/Yellow**: `#fee94b`
- **Cream**: `#f5f2ea`
- **Gray text**: `#687680`
- **Dark/Ink**: `#111111`
- **Red accent**: `#e74c3c`

Colors are defined in `/lib/constants.ts` - import `COLORS` constant to refactor if needed.

## Client vs Server Components

All components are **client components** (`'use client'`) because they:
- Manage internal state (hover states, form inputs)
- Handle user interactions (scroll, click, form submission)
- Use React hooks (useState)

Can be refactored to server components if needed by removing state management.

## Next Steps

1. Create the page at `src/app/(public)/landing-editorial.tsx`
2. Update `EditorialHeader` to accept `onScrollToSection` prop for consistency
3. Adapt hardcoded data (topics, recent episodes) to props or fetch from database
4. Test responsive behavior at various breakpoints
5. Consider extracting repeated inline styles to CSS or Tailwind utilities
