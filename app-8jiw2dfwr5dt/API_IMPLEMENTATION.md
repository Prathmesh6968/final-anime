# API Implementation - Direct REST Approach

## Overview
Updated the AnimeStream application to use a simplified direct REST API approach for fetching data from Supabase, combined with localStorage for client-side data storage.

## Implementation Details

### 1. Direct REST API (`src/db/restApi.ts`)
Created a lightweight REST API wrapper that directly calls Supabase REST endpoints:

```typescript
export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
```

**Benefits:**
- Lightweight (no heavy Supabase client library overhead)
- Direct control over API calls
- Simple and transparent
- Easy to debug

### 2. LocalStorage Integration
Implemented client-side storage for user-specific data:

#### Watch History
```typescript
// Save watch progress
saveWatch(animeId, season, episode);

// Get watch progress
const progress = getWatch(animeId);
// Returns: { season: 1, episode: 5 }
```

#### Favorites
```typescript
// Add to favorites
saveFavorite(animeId);

// Remove from favorites
removeFavorite(animeId);

// Check if favorited
const isFav = isFavorited(animeId);

// Get all favorites
const favs = getFavorites();
// Returns: ['anime-id-1', 'anime-id-2', ...]
```

### 3. Hybrid Approach
The implementation uses a hybrid approach:

**Direct REST API for:**
- ✅ Anime browsing (public data)
- ✅ Episode fetching (public data)
- ✅ Search and filtering (client-side)

**Supabase Client for:**
- ✅ Authentication (requires auth context)
- ✅ Comments (requires user context)
- ✅ Profile management (requires auth)

**LocalStorage for:**
- ✅ Watch history (client-side tracking)
- ✅ Favorites (client-side storage)

## API Usage Examples

### Fetching Anime List
```typescript
// Get all anime
const anime = await api<AnimeData[]>('anime_data?order=title.asc');

// Get anime by ID
const anime = await api<AnimeData[]>('anime_data?id=eq.123');

// Get anime by slug
const anime = await api<AnimeData[]>('anime_data?slug=eq.attack-on-titan');
```

### Fetching Episodes
```typescript
// Get all episodes for an anime
const episodes = await api<EpisodeData[]>(
  'episodes_data?anime_id=eq.123&order=season.asc,episode.asc'
);

// Get specific episode
const episode = await api<EpisodeData[]>(
  'episodes_data?anime_id=eq.123&season=eq.1&episode=eq.5'
);
```

### Managing Watch History
```typescript
// Save progress when user watches an episode
saveWatch(animeId, 1, 5); // Season 1, Episode 5

// Get progress when user returns
const progress = getWatch(animeId);
if (progress) {
  console.log(`Resume from S${progress.season}E${progress.episode}`);
}
```

### Managing Favorites
```typescript
// Add to favorites
saveFavorite(animeId);

// Check if favorited
if (isFavorited(animeId)) {
  console.log('Already in favorites');
}

// Get all favorite anime
const favoriteIds = getFavorites();
const favoriteAnime = await Promise.all(
  favoriteIds.map(id => api<AnimeData[]>(`anime_data?id=eq.${id}`))
);
```

## Client-Side Filtering
Since we fetch all anime at once, filtering is done client-side:

```typescript
// Search
filtered = anime.filter(a => 
  a.title.toLowerCase().includes(search.toLowerCase())
);

// Filter by genre
filtered = anime.filter(a => 
  a.genres.toLowerCase().includes(genre.toLowerCase())
);

// Filter by status
filtered = anime.filter(a => a.status === 'Ongoing');

// Sort by score
filtered.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
```

## Advantages

### Performance
- ✅ Fewer dependencies (smaller bundle size)
- ✅ Direct API calls (no middleware overhead)
- ✅ Client-side caching via localStorage
- ✅ Fast filtering and sorting (in-memory)

### Simplicity
- ✅ Easy to understand and debug
- ✅ Transparent data flow
- ✅ No complex query builders
- ✅ Direct control over requests

### Flexibility
- ✅ Easy to add custom logic
- ✅ Simple to extend
- ✅ Works offline (localStorage data)
- ✅ No vendor lock-in

## Limitations

### Scalability
- ⚠️ Client-side filtering may be slow with 1000+ anime
- ⚠️ No server-side pagination (fetches all data)
- ⚠️ LocalStorage has 5-10MB limit

### Data Sync
- ⚠️ Watch history not synced across devices
- ⚠️ Favorites not synced across devices
- ⚠️ No real-time updates

### Security
- ⚠️ LocalStorage data can be cleared by user
- ⚠️ No server-side validation for favorites/history
- ⚠️ Data not backed up

## Migration Path

If you need to scale up later, you can easily migrate to server-side storage:

### Step 1: Add Database Tables
```sql
-- Already exists, just need to use them
CREATE TABLE favorites (...);
CREATE TABLE watch_history (...);
```

### Step 2: Migrate LocalStorage Data
```typescript
// Read from localStorage
const localFavorites = getFavorites();

// Write to database
for (const animeId of localFavorites) {
  await supabase.from('favorites').insert({
    user_id: userId,
    anime_id: animeId
  });
}

// Clear localStorage
localStorage.removeItem('favorites');
```

### Step 3: Update API Calls
```typescript
// Before (localStorage)
const favorites = getFavorites();

// After (database)
const { data } = await supabase
  .from('favorites')
  .select('*')
  .eq('user_id', userId);
```

## Best Practices

### 1. Error Handling
```typescript
try {
  const data = await api('anime_data');
  // Process data
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly message
}
```

### 2. Loading States
```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  api('anime_data')
    .then(data => setAnime(data))
    .finally(() => setLoading(false));
}, []);
```

### 3. Data Validation
```typescript
const data = await api<AnimeData[]>('anime_data');
const validData = Array.isArray(data) ? data : [];
```

### 4. LocalStorage Checks
```typescript
// Check if localStorage is available
const isStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch {
    return false;
  }
};
```

## Testing

### Test API Calls
```typescript
// Test in browser console
const api = async (path) => {
  const r = await fetch(`https://your-project.supabase.co/rest/v1/${path}`, {
    headers: {
      apikey: 'your-key',
      Authorization: `Bearer your-key`
    }
  });
  return r.json();
};

// Test queries
await api('anime_data?limit=5');
await api('anime_data?id=eq.123');
await api('episodes_data?anime_id=eq.123');
```

### Test LocalStorage
```typescript
// Test in browser console
localStorage.setItem('test-favorite', JSON.stringify(['anime-1', 'anime-2']));
const favorites = JSON.parse(localStorage.getItem('test-favorite'));
console.log(favorites); // ['anime-1', 'anime-2']
```

## Summary

The new implementation provides:
- ✅ Lightweight and fast data fetching
- ✅ Simple client-side storage
- ✅ Easy to understand and maintain
- ✅ Works without authentication for public data
- ✅ Hybrid approach for best of both worlds

Perfect for small to medium-sized anime catalogs (< 1000 anime) with simple filtering needs.

---

**Status**: ✅ Implemented and Tested
**Date**: 2025-12-28
**Approach**: Direct REST API + LocalStorage + Supabase Client (hybrid)
