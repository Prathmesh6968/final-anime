# Supabase Database - Auth Only Configuration

## Overview
Updated the application to use Supabase **only for authentication** (login and signup). All other features now use localStorage for client-side storage.

## What Changed

### 1. Authentication (Still Using Supabase) ✅
**Files**: 
- `src/contexts/AuthContext.tsx`
- `src/db/supabase.ts`

**Supabase Tables Used**:
- `auth.users` - User authentication
- `profiles` - User profile data (synced from auth.users)

**Features**:
- ✅ User registration (signup)
- ✅ User login (signin)
- ✅ User logout (signout)
- ✅ Session management
- ✅ Profile data (username, role, avatar)

### 2. Favorites (Now Using localStorage) 🔄
**File**: `src/db/api.ts` - `favoritesApi`

**Storage**: localStorage key `anime_favorites`

**Features**:
- ✅ Add anime to favorites
- ✅ Remove anime from favorites
- ✅ Check if anime is favorited
- ✅ Get user's favorite anime list

**Implementation**:
```typescript
// Favorites stored as array of anime IDs
localStorage.setItem('anime_favorites', JSON.stringify(['anime1', 'anime2']));
```

### 3. Comments (Now Using localStorage) 🔄
**File**: `src/db/api.ts` - `commentsApi`

**Storage**: localStorage key `anime_comments`

**Features**:
- ✅ Post comments on anime pages
- ✅ Reply to comments
- ✅ Delete comments
- ✅ View comments and replies

**Implementation**:
```typescript
// Comments stored as array of comment objects
const comment = {
  id: 'comment_123',
  user_id: 'user_id',
  anime_id: 'anime_id',
  content: 'Great anime!',
  parent_id: null, // or parent comment ID for replies
  created_at: '2025-12-28T...',
  user: {
    id: 'user_id',
    username: 'username',
    avatar_url: null,
  }
};
```

**User Profile Caching**:
- When user logs in, profile is saved to localStorage
- Comments use cached profile data for username display
- Storage key: `user_profiles`

### 4. Watch History (Already Using localStorage) ✅
**File**: `src/db/api.ts` - `watchHistoryApi`

**Storage**: localStorage key `anime_watch_history`

**Features**:
- ✅ Track watched episodes
- ✅ Continue watching from last position
- ✅ View watch history

**Implementation**:
```typescript
// Watch history stored per anime
const history = {
  'anime_slug': {
    season: 1,
    episode: 5,
    timestamp: Date.now()
  }
};
```

### 5. Anime Data (Still Using Supabase) ✅
**File**: `src/db/api.ts` - `animeApi`

**Supabase Tables Used**:
- `anime_data` - Anime information (read-only)
- `episodes_data` - Episode information (read-only)

**Features**:
- ✅ Browse anime catalog
- ✅ Search anime
- ✅ Filter by genre, status, rating
- ✅ View anime details
- ✅ Get episode list

**Note**: These tables are read-only and don't require user authentication.

## Database Tables Status

### Still Using Supabase
| Table | Purpose | Access |
|-------|---------|--------|
| `auth.users` | User authentication | Supabase Auth |
| `profiles` | User profile data | Read after login |
| `anime_data` | Anime catalog | Public read |
| `episodes_data` | Episode information | Public read |

### Removed from Supabase (Now localStorage)
| Table | New Storage | Key |
|-------|-------------|-----|
| `favorites` | localStorage | `anime_favorites` |
| `comments` | localStorage | `anime_comments` |
| `watch_history` | localStorage | `anime_watch_history` |

### New localStorage Keys
| Key | Purpose | Data Type |
|-----|---------|-----------|
| `anime_favorites` | User's favorite anime IDs | `string[]` |
| `anime_comments` | All comments | `Comment[]` |
| `anime_watch_history` | Watch progress | `Record<string, WatchData>` |
| `user_profiles` | Cached user profiles | `Record<string, UserProfile>` |

## Benefits of This Approach

### 1. Reduced Database Load
- ✅ No database queries for favorites
- ✅ No database queries for comments
- ✅ No database queries for watch history
- ✅ Faster response times

### 2. Simplified Architecture
- ✅ Less complex RLS policies
- ✅ Fewer database tables to manage
- ✅ No need for database migrations for features
- ✅ Easier to debug and maintain

### 3. Better Performance
- ✅ Instant favorites toggle
- ✅ Instant comment posting
- ✅ No network latency for user data
- ✅ Works offline (for cached data)

### 4. Cost Savings
- ✅ Reduced Supabase database usage
- ✅ Fewer API calls
- ✅ Lower bandwidth consumption

## Limitations

### 1. Data Persistence
- ⚠️ Data is stored per browser/device
- ⚠️ Clearing browser data removes favorites/comments
- ⚠️ No sync across devices
- ⚠️ No backup of user data

### 2. Comments
- ⚠️ Comments are device-specific
- ⚠️ Other users won't see your comments
- ⚠️ Comments don't persist across browsers

### 3. Favorites
- ⚠️ Favorites are device-specific
- ⚠️ No sync across devices
- ⚠️ Lost if localStorage is cleared

## Migration Guide

### For Existing Users
If you had data in Supabase before this change:

1. **Favorites**: Will need to re-add favorites
2. **Comments**: Previous comments won't be visible
3. **Watch History**: Already using localStorage, no change

### For New Users
- Everything works out of the box
- No migration needed

## Technical Implementation

### 1. Updated Files

**src/db/api.ts**:
- Updated `favoritesApi` to use localStorage (already done)
- Updated `commentsApi` to use localStorage (new)
- Kept `animeApi` using Supabase for read-only data
- Kept `watchHistoryApi` using localStorage (already done)

**src/contexts/AuthContext.tsx**:
- Added profile caching to localStorage
- Saves username and avatar when user logs in
- Used by comments to display user info

### 2. Data Flow

**Login Flow**:
```
User Login → Supabase Auth → Get Profile → Save to localStorage
```

**Comment Flow**:
```
Post Comment → Get User from localStorage → Save Comment to localStorage
```

**Favorites Flow**:
```
Toggle Favorite → Update localStorage Array → Re-render UI
```

### 3. Code Examples

**Checking if Anime is Favorited**:
```typescript
const isFavorited = await favoritesApi.isFavorited(userId, animeId);
// Reads from localStorage: anime_favorites
```

**Adding a Comment**:
```typescript
const comment = await commentsApi.createComment(
  userId,
  animeId,
  'Great anime!',
  parentId // optional for replies
);
// Saves to localStorage: anime_comments
```

**Getting User Favorites**:
```typescript
const favorites = await favoritesApi.getUserFavorites(userId);
// Reads from localStorage: anime_favorites
// Fetches anime data from Supabase: anime_data
```

## Testing Checklist

- [x] User can register and login
- [x] User profile loads correctly
- [x] User can add/remove favorites
- [x] Favorites persist across page reloads
- [x] User can post comments
- [x] Comments display with username
- [x] User can reply to comments
- [x] User can delete own comments
- [x] Watch history tracks progress
- [x] Continue watching works
- [x] Anime catalog loads from Supabase
- [x] Search and filters work
- [x] Lint passes with no errors

## Future Enhancements

### Option 1: Keep localStorage (Current)
**Pros**:
- Simple and fast
- No database costs
- Works offline

**Cons**:
- No cross-device sync
- Data can be lost

### Option 2: Add Supabase Sync (Optional)
**Implementation**:
- Keep localStorage for instant updates
- Periodically sync to Supabase
- Best of both worlds

**Benefits**:
- Fast local updates
- Cross-device sync
- Data backup

### Option 3: Hybrid Approach
**Implementation**:
- Favorites: Supabase (for sync)
- Comments: localStorage (device-specific)
- Watch History: localStorage (device-specific)

## Rollback Instructions

If you need to revert to using Supabase for all features:

1. **Restore api.ts**:
   - Revert `commentsApi` to use Supabase queries
   - Keep `favoritesApi` using localStorage or revert

2. **Update Database**:
   - Ensure RLS policies are in place
   - Test all CRUD operations

3. **Test Features**:
   - Verify comments work
   - Verify favorites work
   - Check cross-device sync

## Summary

### What Uses Supabase Now
1. ✅ User Authentication (login/signup)
2. ✅ User Profiles (username, role)
3. ✅ Anime Data (read-only catalog)
4. ✅ Episode Data (read-only)

### What Uses localStorage Now
1. ✅ Favorites
2. ✅ Comments
3. ✅ Watch History

### Database Tables Needed
- `auth.users` (Supabase Auth)
- `profiles` (User data)
- `anime_data` (Anime catalog)
- `episodes_data` (Episodes)

### Database Tables NOT Needed
- ~~`favorites`~~ (using localStorage)
- ~~`comments`~~ (using localStorage)
- ~~`watch_history`~~ (using localStorage)

---

**Status**: ✅ Complete

Supabase is now used only for authentication and read-only anime data. All user-specific features use localStorage for fast, client-side storage!
