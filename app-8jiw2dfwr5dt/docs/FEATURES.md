# AnimeStream - Feature Documentation

## Overview
AnimeStream is a comprehensive anime streaming platform built with React, TypeScript, Tailwind CSS, and Supabase. The platform features a Crunchyroll-inspired design with deep orange accents and a dark theme.

## Core Features

### 1. User Authentication
- **Username/Password Login**: Secure authentication using Supabase Auth
- **Registration**: New user signup with automatic profile creation
- **Role-Based Access**: User and Admin roles with different permissions
- **Auto-Admin**: First registered user automatically becomes admin
- **Session Management**: Persistent login sessions across page refreshes

### 2. Anime Browsing
- **Grid Layout**: Responsive grid displaying anime cards (1-4 columns based on screen size)
- **Search**: Real-time search by anime title (English or Japanese)
- **Filters**:
  - Genres (Action, Adventure, Comedy, Drama, Fantasy, etc.)
  - Status (Ongoing, Completed)
  - Rating (G, PG, PG-13, R, R+)
- **Sorting**: Sort by score, release date, or title
- **Pagination**: Navigate through large anime collections

### 3. Anime Details
- **Full Information**: Title, Japanese title, score, status, episodes, genres, duration, rating
- **Banner Display**: Large banner image with gradient overlay
- **Episode List**: Organized by season with play buttons
- **Favorites Toggle**: Add/remove anime from favorites
- **Comments Section**: Post and view comments with nested replies
- **User Avatars**: Display user initials in comment threads

### 4. Video Player
- **Iframe Embed**: Full-screen video playback
- **Episode Navigation**: Previous/Next episode buttons
- **Episode List**: Quick access to all episodes
- **Watch History**: Automatically tracks viewing progress
- **Season Organization**: Episodes grouped by season

### 5. User Features
- **Favorites Collection**: Personal list of favorite anime
- **Watch History**: Recently watched episodes with timestamps
- **Profile Management**: Edit username and view account details
- **Role Display**: Badge showing user role (user/admin)

### 6. Admin Panel
- **User Management**: View all registered users
- **User Details**: Username, email, role, and registration date
- **Role Indicators**: Visual badges for admin vs regular users

### 7. Responsive Design
- **Desktop-First**: Optimized for large screens (1920x1080, 1440x900)
- **Mobile Adaptive**: Fully functional on mobile devices (375x667, 414x896)
- **Sidebar Navigation**: Desktop sidebar, mobile sheet menu
- **Touch-Friendly**: Large tap targets and smooth interactions

### 8. Design System
- **Color Scheme**:
  - Primary: Deep Orange (#F47521)
  - Background: Dark Charcoal (#23252B) and Black (#000000)
  - Accent: Bright White (#FFFFFF)
- **Typography**: Bold sans-serif with high contrast
- **Animations**: Smooth hover effects with orange glow
- **Cards**: Sharp rectangular cards with minimal shadows

## Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality UI components
- **React Router**: Client-side routing
- **Vite**: Fast build tooling

### Backend
- **Supabase**: PostgreSQL database
- **Supabase Auth**: User authentication
- **Row Level Security**: Data access policies
- **Real-time**: Live data updates (not used for subscriptions due to limitations)

## Database Schema

### Tables
1. **profiles**: User profiles with role management
2. **anime_data**: Anime information and metadata
3. **episodes_data**: Episode details with iframe URLs
4. **favorites**: User favorite anime relationships
5. **comments**: User comments with nested replies
6. **watch_history**: Viewing history tracking

### Security
- **RLS Policies**: Row-level security on all tables
- **Admin Functions**: Helper functions for role checking
- **User Isolation**: Users can only access their own data
- **Public Read**: Anime data is publicly readable

## User Flows

### New User Registration
1. Navigate to /register
2. Enter username and password
3. Auto-login after successful registration
4. First user becomes admin automatically

### Browsing Anime
1. View anime grid on homepage
2. Use sidebar filters to narrow results
3. Search by title in header
4. Click anime card to view details

### Watching Episodes
1. Click episode from anime detail page
2. Video player loads with iframe
3. Navigate between episodes
4. Watch history automatically updated

### Managing Favorites
1. Click heart icon on anime detail page
2. View all favorites in /favorites
3. Remove from favorites by clicking heart again

## API Endpoints

### Anime API
- `getAnimeList()`: Paginated anime with filters
- `getAnimeBySlug()`: Single anime by slug
- `getAnimeById()`: Single anime by ID

### Episodes API
- `getEpisodesByAnimeId()`: All episodes for an anime
- `getEpisode()`: Specific episode by season/number

### Favorites API
- `getUserFavorites()`: User's favorite anime
- `isFavorited()`: Check if anime is favorited
- `addFavorite()`: Add to favorites
- `removeFavorite()`: Remove from favorites

### Comments API
- `getCommentsByAnimeId()`: All comments for an anime
- `getReplies()`: Replies to a comment
- `createComment()`: Post new comment
- `deleteComment()`: Delete comment

### Watch History API
- `getUserWatchHistory()`: Recent watch history
- `updateWatchHistory()`: Track episode viewing

### Profile API
- `getProfileById()`: User profile
- `updateProfile()`: Update profile
- `getAllProfiles()`: All users (admin only)

## Sample Data

The database includes 12 sample anime:
- Attack on Titan
- Demon Slayer
- My Hero Academia
- One Piece
- Jujutsu Kaisen
- Naruto
- Death Note
- Fullmetal Alchemist: Brotherhood
- Steins Gate
- Sword Art Online
- Tokyo Ghoul
- Hunter x Hunter

Each anime has 5 sample episodes in Season 1 for testing.

## Future Enhancements

Possible features to add:
- User ratings and reviews
- Anime recommendations
- Advanced search with multiple criteria
- User profiles with avatars
- Social features (follow users, activity feed)
- Watchlist separate from favorites
- Episode progress tracking (resume playback)
- Multiple video sources
- Subtitle support
- Download functionality
- Notification system
- Email verification
- Password reset
- OAuth providers (Google, GitHub)
