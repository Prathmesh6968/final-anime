# Anime Streaming Website Requirements Document

## 1. Website Overview

### 1.1 Website Name
HindiDubAnime
\n### 1.2 Website Description
A streamlined anime streaming platform that allows users to browse anime catalog, search titles, watch episodes with season/episode navigation, and discover similar anime through suggestions.

## 2. Core Features
\n### 2.1 Anime Browsing (index.html)
- Display anime catalog in grid layout with banner images and titles
- Fetch anime list from anime_data table ordered by title
- Click on anime card to navigate to detail page

### 2.2 Search Functionality
- Real-time search filter by anime title (case-insensitive)\n- Search box in header available on all pages
- Instant results update as user types

### 2.3 Anime Detail Page (anime.html)
- Display selected anime information
- Show anime banner, title, and metadata
- Navigate to watch page for episode playback

### 2.4 Video Playback (watch.html)
- Embed episode video using iframe from episodes_data table
- Season selector dropdown to switch between seasons
- Episode selector dropdown to choose specific episode\n- Previous/Next episode navigation buttons
- Auto-load last watched episode from localStorage
- Save watch progress (season and episode) to localStorage
- Skip intro function (85 seconds forward seek)

### 2.5 Suggestions Section
- Display 8 random anime recommendations below video player
- Grid layout with banner images and titles
- Click to navigate to suggested anime detail page

## 3. Database Schema
\n### 3.1 anime_data Table
- id (primary key, auto-generated)
- title (text)
- slug (text, unique)
- banner (text, image URL)
- score (text)
- japanese (text)
- episodes (text)\n- status (text)
- aired (text)
- genres (text)
- duration (text)\n- rating (text)
\n### 3.2 episodes_data Table
- id (primary key, auto-generated)
- anime_id (foreign key, references anime_data.id)
- season (integer)
- episode (integer)
- title (text)
- iframe (text, embed URL)
- url (text)\n- unique constraint on (anime_id, season, episode)
\n## 4. Technical Integration\n
### 4.1 Supabase Connection
- Supabase URL: https://jkszncegihkumudtbawr.supabase.co
- API Key: sb_publishable_5u5hvA8zL0nxdJRPvvKhIA_-YvXylqG
- REST API endpoint: /rest/v1/\n- Headers: apikey and Authorization with Bearer token

### 4.2 Data Fetching Logic (app.js)
- api() function for Supabase REST API calls
- Fetch anime_data with order=title.asc for alphabetical listing\n- Fetch episodes_data filtered by anime_id
- Query limit parameter for suggestions (limit=8)

### 4.3 Local Storage
- saveWatch(id, season, episode): Store watch progress
- getWatch(id): Retrieve last watched position
- Storage key format: 'watch-{anime_id}'
- Data format: JSON with season and episode numbers

### 4.4 Page Navigation
- index.html: Homepage with anime grid
- anime.html: Anime detail page (receives id parameter)
- watch.html: Video player page (receives id parameter)
- URL parameters: ?id={anime_id}

## 5. Design Style

### 5.1 Home Page Design (index.html)\nReference: https://watchanimeworld.in/
\n#### Color Scheme
- Primary background: Deep navy blue (#0A0E27) with subtle gradient overlay
- Secondary background: Dark purple-blue (#1A1F3A) for cards and sections\n- Accent color: Vibrant cyan-blue (#00D9FF) for buttons and highlights
- Text: Pure white (#FFFFFF) for titles, light gray (#B8C5D6) for descriptions

#### Visual Details\n- Smooth border radius (8px-12px) for cards and buttons with modern rounded corners
- Layered box shadows (0 8px 24px rgba(0,217,255,0.15)) creating floating card effect
- Gradient overlays on anime banners (linear-gradient from transparent to dark blue)
- Hover animations: smooth scale transform (1.05) with 0.3s transition and cyan glow effect
- Glassmorphism effect on header with backdrop-filter blur

#### Layout Structure
- Hero section with featured anime carousel at top with auto-sliding animation
- Sticky navigation bar with transparent background and blur effect
- Multi-row grid layout (5-6 columns on desktop) with responsive breakpoints
- Anime cards with vertical poster images, title overlay at bottom with gradient fade\n- Category tabs with smooth underline animation on hover and active state
- Infinite scroll loading with skeleton placeholders

#### Animation Effects
- Fade-in animation for cards on scroll with staggered delay
- Smooth carousel transitions with slide and fade effects
- Ripple effect on button clicks\n- Loading spinner with rotating gradient border

### 5.2 Anime Detail Page Design (anime.html)
Reference: https://watchanimeworld.in/series/naruto-shippuden/

#### Color Scheme
- Background: Gradient from dark navy (#0A0E27) to deep purple (#1A0F2E)
- Content cards: Semi-transparent dark blue (#1A1F3A) with 80% opacity
- Accent: Electric blue (#00D9FF) for play button and episode highlights
- Text: White (#FFFFFF) for headings, soft gray (#C5D0E6) for body text
\n#### Visual Details
- Large banner image at top with parallax scroll effect and gradient overlay
- Rounded corners (12px) for all content containers
- Soft shadows (0 12px 32px rgba(0,0,0,0.4)) for depth layering
- Pill-shaped genre tags with cyan border and hover fill animation
- Episode cards with thumbnail preview and hover zoom effect (1.08 scale)

#### Layout Structure
- Full-width hero banner with anime artwork and blur backdrop\n- Two-column layout: left side for anime info, right side for metadata panel
- Tabbed interface for Episodes/Overview/Characters with smooth tab switching animation
- Episode grid (4 columns) with thumbnail, episode number, and title
- Sticky sidebar with anime stats, genres, and quick action buttons
- Related anime section at bottom with horizontal scrollable carousel

#### Animation Effects
- Banner parallax effect on page scroll
- Tab content fade-in transition (0.4s ease)
- Episode card hover with thumbnail zoom and cyan border glow
- Play button pulse animation with expanding ring effect

### 5.3 Episode Player Page Design (watch.html)
Reference: https://watchanimeworld.in/episode/naruto-shippuden-15x337/\n
#### Color Scheme\n- Background: Pure black (#000000) for distraction-free viewing
- Player controls: Dark charcoal (#1C1C1E) with subtle transparency
- Accent: Bright cyan (#00E5FF) for progress bar and active controls
- Text: White (#FFFFFF) for episode title, light gray (#A0A0A0) for metadata

#### Visual Details
- Minimal border radius (4px) for player controls to maintain clean lines
- Subtle shadows (0 4px 16px rgba(0,0,0,0.6)) for control bar separation
- Thin cyan progress bar (3px height) with smooth fill animation
- Icon buttons with hover state showing cyan background circle
- Episode selector with dark dropdown menu and cyan highlight on hover

#### Layout Structure
- Full-width responsive video player (16:9 aspect ratio) centered at top
- Custom control bar below player with prev/next buttons, season/episode dropdowns, and skip intro button
- Episode navigation sidebar on right (collapsible on mobile) with vertical episode list
- Comments section below player with nested reply structure\n- Next episode auto-play countdown overlay (bottom-right corner of player)
- Floating action buttons for download and share (right side of player)

#### Animation Effects\n- Control bar auto-hide after 3 seconds of inactivity with fade-out transition
- Progress bar smooth fill animation synced with video playback
- Volume slider slide-in animation on hover
- Episode list smooth scroll with snap-to-item behavior
- Skip intro button slide-in from right with bounce effect
- Next episode countdown with circular progress ring animation
\n### 5.4 Global CSS Features

#### Typography
- Primary font: 'Inter' or 'Poppins' for modern, clean readability
- Bold weights (600-700) for titles and navigation
- Letter spacing: -0.02em for headings, normal for body text

#### Responsive Behavior
- Mobile-first approach with breakpoints at 768px, 1024px, 1440px
- Hamburger menu on mobile with slide-in navigation drawer
- Grid columns adjust: 2 columns on mobile, 4 on tablet, 6 on desktop
- Touch-friendly button sizes (minimum 44px tap target)

#### Performance Optimizations
- Lazy loading for images with blur-up placeholder effect
- CSS transforms for animations (GPU-accelerated)\n- Debounced scroll events for performance
- Preload critical fonts and hero images
\n## 6. Reference Links\n- Home page design: https://watchanimeworld.in/\n- Anime detail page design: https://watchanimeworld.in/series/naruto-shippuden/
- Episode player page design: https://watchanimeworld.in/episode/naruto-shippuden-15x337/

## 7. Note
The original requirements document does not include sign-in or login functionality. The website operates without user authentication, using only localStorage for tracking watch progress locally on each device.