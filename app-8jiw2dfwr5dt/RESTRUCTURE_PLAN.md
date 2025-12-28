# AnimeStream Restructure Plan - Professional Anime Streaming Features

## Current Features ✅
- Basic anime browsing with cards
- Search and filters
- Video player with episode navigation
- Watch history (localStorage)
- Favorites (localStorage)
- Comments system
- User authentication
- Admin panel

## New Features to Add (Inspired by Professional Anime Sites)

### 1. Enhanced Home Page
- [ ] Hero/Featured anime slider (top banner)
- [ ] Recently Added section
- [ ] Popular/Trending anime section
- [ ] Currently Airing section
- [ ] Continue Watching section (for logged-in users)
- [ ] Genres quick access
- [ ] Top rated anime

### 2. Advanced Video Player
- [ ] Multiple video sources/servers
- [ ] Quality selector (1080p, 720p, 480p, 360p)
- [ ] Auto-play next episode
- [ ] Theater mode
- [ ] Skip intro/outro buttons
- [ ] Playback speed control
- [ ] Subtitle toggle
- [ ] Picture-in-Picture mode
- [ ] Keyboard shortcuts

### 3. Better Anime Detail Page
- [ ] Larger banner/cover image
- [ ] Trailer video
- [ ] Related anime section
- [ ] Character list
- [ ] Staff information
- [ ] Reviews section
- [ ] Rating system
- [ ] Share buttons
- [ ] Add to watchlist button

### 4. Enhanced Navigation
- [ ] Mega menu with genres
- [ ] Quick search with autocomplete
- [ ] Recently viewed (dropdown)
- [ ] Notifications (new episodes)
- [ ] Dark/Light theme toggle

### 5. Discovery Features
- [ ] Seasonal anime page
- [ ] Anime schedule/calendar
- [ ] Top anime by genre
- [ ] Random anime button
- [ ] Advanced filters (year, studio, type)

### 6. User Features
- [ ] Watchlist management
- [ ] Custom lists (Plan to Watch, Watching, Completed, Dropped)
- [ ] Anime ratings
- [ ] Watch statistics
- [ ] Profile customization
- [ ] Follow other users

### 7. Performance & UX
- [ ] Lazy loading images
- [ ] Infinite scroll
- [ ] Progressive Web App (PWA)
- [ ] Offline mode
- [ ] Loading skeletons
- [ ] Error boundaries

### 8. Additional Features
- [ ] Anime news section
- [ ] Discussion forums
- [ ] Episode release notifications
- [ ] Download links
- [ ] Dub/Sub toggle
- [ ] Multi-language support

## Implementation Priority

### Phase 1: Core Enhancements (High Priority)
1. Enhanced Home Page with sections
2. Better video player with quality selector
3. Continue Watching section
4. Auto-play next episode
5. Theater mode

### Phase 2: Discovery (Medium Priority)
1. Recently Added section
2. Popular/Trending section
3. Seasonal anime
4. Advanced search

### Phase 3: User Experience (Medium Priority)
1. Watchlist management
2. Custom lists
3. Anime ratings
4. Better navigation

### Phase 4: Advanced Features (Low Priority)
1. Multiple video sources
2. Subtitle options
3. Download links
4. Social features

## Technical Implementation

### New Components Needed
```
src/
├── components/
│   ├── home/
│   │   ├── HeroSlider.tsx
│   │   ├── RecentlyAdded.tsx
│   │   ├── PopularAnime.tsx
│   │   ├── ContinueWatching.tsx
│   │   └── GenreSection.tsx
│   ├── player/
│   │   ├── VideoPlayer.tsx
│   │   ├── QualitySelector.tsx
│   │   ├── SourceSelector.tsx
│   │   └── PlayerControls.tsx
│   ├── anime/
│   │   ├── AnimeGrid.tsx
│   │   ├── AnimeList.tsx
│   │   ├── AnimeSlider.tsx
│   │   └── RelatedAnime.tsx
│   └── discovery/
│       ├── SeasonalAnime.tsx
│       ├── AnimeCalendar.tsx
│       └── TopAnime.tsx
```

### New Pages Needed
```
src/pages/
├── Seasonal.tsx
├── Schedule.tsx
├── TopAnime.tsx
├── Watchlist.tsx
└── Discover.tsx
```

### Database Schema Updates
```sql
-- Add video sources
CREATE TABLE video_sources (
  id uuid PRIMARY KEY,
  episode_id uuid REFERENCES episodes_data(id),
  source_name text,
  quality text,
  url text
);

-- Add anime ratings
CREATE TABLE anime_ratings (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  anime_id uuid REFERENCES anime_data(id),
  rating int CHECK (rating >= 1 AND rating <= 10)
);

-- Add watchlist
CREATE TABLE watchlist (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  anime_id uuid REFERENCES anime_data(id),
  status text CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'dropped', 'on_hold'))
);
```

## Questions for User

To implement features similar to animesalt.cc, please specify:

1. **Which features are most important?**
   - Hero slider?
   - Multiple video sources?
   - Continue watching?
   - Seasonal anime?
   - All of the above?

2. **Video Player Requirements:**
   - Do you need multiple video sources/servers?
   - Quality selection?
   - Auto-play next episode?
   - Download links?

3. **Home Page Layout:**
   - What sections should appear on home page?
   - Hero slider at top?
   - Recently added?
   - Popular anime?
   - Continue watching?

4. **User Features:**
   - Watchlist with status (watching, completed, etc.)?
   - Rating system?
   - Custom lists?

5. **Data Availability:**
   - Does your Supabase database have multiple video sources per episode?
   - Do you have anime popularity/trending data?
   - Do you have seasonal/airing information?

Please let me know which features you want me to implement first, and I'll restructure the application accordingly!
