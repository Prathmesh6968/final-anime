# AnimeStream - Quick Start Guide

## 🚀 Getting Started

### 1. First Time Setup
The application is ready to use! Your Supabase database has been configured with:
- ✅ Complete database schema
- ✅ 12 sample anime with episodes
- ✅ Authentication system
- ✅ Row-level security policies

### 2. Create Your Admin Account
1. Open the application in your browser
2. Click "Sign Up" or navigate to `/register`
3. Create your account with:
   - **Username**: Choose any username (letters, numbers, underscore only)
   - **Password**: Minimum 6 characters
4. You will be automatically logged in
5. **Important**: The first user to register becomes an admin automatically!

### 3. Explore the Platform

#### Browse Anime
- **Home Page** (`/`): View all available anime in a grid layout
- **Search**: Use the search bar in the header to find anime by title
- **Filters**: Use the sidebar to filter by:
  - Genres (Action, Adventure, Comedy, etc.)
  - Status (Ongoing, Completed)
  - Rating (G, PG, PG-13, R, R+)
- **Sort**: Sort anime by score, release date, or title

#### Watch Episodes
1. Click on any anime card to view details
2. Click on an episode to start watching
3. Use Previous/Next buttons to navigate between episodes
4. Your watch history is automatically tracked

#### Manage Favorites
1. On any anime detail page, click the heart icon to add to favorites
2. View all your favorites at `/favorites`
3. Click the heart icon again to remove from favorites

#### Post Comments
1. Navigate to any anime detail page
2. Scroll down to the comments section
3. Write your comment and click "Post Comment"
4. View comments from other users

#### Profile Management
1. Click your user icon in the header
2. Select "Profile" from the dropdown
3. View your watch history
4. Edit your username if needed

#### Admin Panel (Admin Only)
1. Click your user icon in the header
2. Select "Admin Panel" from the dropdown
3. View all registered users
4. See user roles and registration dates

## 📱 Features Overview

### User Features
- ✅ User registration and login
- ✅ Browse anime catalog with pagination
- ✅ Search anime by title (English or Japanese)
- ✅ Filter by genres, status, and rating
- ✅ View detailed anime information
- ✅ Watch episodes with iframe player
- ✅ Add/remove favorites
- ✅ Post and view comments
- ✅ Track watch history
- ✅ Edit profile

### Admin Features
- ✅ View all users
- ✅ See user roles and details
- ✅ First registered user becomes admin

## 🎨 Design Features

### Color Scheme
- **Primary**: Deep Orange (#F47521) - Crunchyroll-inspired
- **Background**: Dark Charcoal (#23252B) and Black (#000000)
- **Accent**: Bright White (#FFFFFF)

### Responsive Design
- Desktop-optimized (1920x1080, 1440x900)
- Mobile-friendly (375x667, 414x896)
- Sidebar navigation on desktop
- Sheet menu on mobile

## 📊 Sample Data

The database includes 12 sample anime:
1. Attack on Titan
2. Demon Slayer
3. My Hero Academia
4. One Piece
5. Jujutsu Kaisen
6. Naruto
7. Death Note
8. Fullmetal Alchemist: Brotherhood
9. Steins Gate
10. Sword Art Online
11. Tokyo Ghoul
12. Hunter x Hunter

Each anime has 5 sample episodes in Season 1 for testing.

## 🔐 Authentication Details

### Login System
- **Method**: Username + Password
- **Email Simulation**: Usernames are converted to `username@miaoda.com` format
- **Verification**: Disabled (auto-login after registration)
- **Session**: Persistent across page refreshes

### Username Rules
- Only letters, numbers, and underscores allowed
- Must be unique
- Cannot be changed after registration (can be updated in profile)

### Password Rules
- Minimum 6 characters
- No special requirements (for demo purposes)

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build Tool**: Vite

### Database Tables
- `profiles`: User profiles with roles
- `anime_data`: Anime information
- `episodes_data`: Episode details
- `favorites`: User favorites
- `comments`: User comments
- `watch_history`: Viewing history

### API Structure
All database operations are in `/src/db/api.ts`:
- `animeApi`: Anime browsing and search
- `episodesApi`: Episode management
- `favoritesApi`: Favorites operations
- `commentsApi`: Comment operations
- `watchHistoryApi`: History tracking
- `profileApi`: User profile management

## 🎯 Next Steps

### For Users
1. Register your account (first user becomes admin!)
2. Browse and watch anime
3. Add favorites
4. Post comments
5. Track your watch history

### For Admins
1. Access the admin panel
2. View all users
3. Monitor platform activity

### For Developers
1. Check `/docs/FEATURES.md` for detailed feature documentation
2. Review `/src/db/api.ts` for API functions
3. Explore `/src/types/types.ts` for TypeScript definitions
4. Customize the theme in `/src/index.css`

## 🐛 Troubleshooting

### Can't Login?
- Make sure you registered first
- Check username format (no special characters except underscore)
- Password must be at least 6 characters

### No Anime Showing?
- Check your filters in the sidebar
- Try clearing all filters
- Make sure you're logged in

### Video Not Playing?
- The sample episodes use placeholder iframe URLs
- Replace with real video URLs in the database for actual playback

### Comments Not Posting?
- Make sure you're logged in
- Check that comment text is not empty
- Refresh the page and try again

## 📞 Support

For issues or questions:
1. Check the TODO.md file for implementation notes
2. Review the FEATURES.md documentation
3. Inspect browser console for errors
4. Check Supabase dashboard for database issues

---

**Enjoy your anime streaming experience! 🎬✨**
