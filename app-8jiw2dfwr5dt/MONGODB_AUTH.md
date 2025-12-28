# MongoDB Authentication Integration

## Overview
The application now uses **MongoDB** for user authentication (login and signup) instead of Supabase Auth. Supabase is still used for anime data (anime_data and episodes_data tables).

## MongoDB Connection
**Connection String**: `mongodb+srv://opparth106:Parthislive@cluster0.zvj6uis.mongodb.net/?appName=Cluster0`

**Database Name**: `anime_streaming`

**Collection**: `users`

## Architecture

### Backend: Supabase Edge Functions
Three Edge Functions handle MongoDB operations:

1. **auth-register** - User registration
2. **auth-login** - User login
3. **auth-profile** - Get user profile

### Frontend: React Context
- **AuthContext.tsx** - Manages authentication state
- **Session Storage** - localStorage for session persistence
- **Profile Caching** - localStorage for user profiles (used by comments)

## User Schema (MongoDB)

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated ID
  username: string,           // Unique username
  password: string,           // SHA-256 hashed password
  email: string,              // Format: username@hindidub.anime
  role: 'user' | 'admin',     // First user is admin, rest are users
  created_at: Date,           // Account creation timestamp
  last_login: Date,           // Last login timestamp (optional)
  avatar_url: string | null   // Profile avatar URL (optional)
}
```

## Authentication Flow

### Registration Flow
```
1. User enters username and password
2. Frontend validates input (username format, password length)
3. Frontend calls Edge Function: POST /functions/v1/auth-register
4. Edge Function:
   - Validates input
   - Checks if username exists
   - Hashes password (SHA-256)
   - Determines role (first user = admin)
   - Creates user in MongoDB
   - Returns user data (without password)
5. Frontend shows success message
6. User can now log in
```

### Login Flow
```
1. User enters username and password
2. Frontend calls Edge Function: POST /functions/v1/auth-login
3. Edge Function:
   - Finds user by username
   - Hashes provided password
   - Compares with stored hash
   - Updates last_login timestamp
   - Generates session token
   - Returns user data + session token
4. Frontend stores session in localStorage
5. Frontend fetches user profile
6. User is logged in
```

### Session Management
```
1. Session stored in localStorage:
   - Key: 'mongo_session'
   - Value: { token, expires_at }
   
2. User data stored in localStorage:
   - Key: 'mongo_user'
   - Value: { id, username, email, role, created_at }

3. Session expires after 30 days
4. On app load, check for existing session
5. If session exists and not expired, auto-login
```

### Profile Fetching
```
1. Frontend calls Edge Function: GET /functions/v1/auth-profile
2. Includes session token in Authorization header
3. Edge Function:
   - Decodes token to get user ID
   - Fetches user from MongoDB
   - Returns user data (without password)
4. Frontend caches profile in localStorage for comments
```

## Edge Functions

### 1. auth-register
**Endpoint**: `POST /functions/v1/auth-register`

**Request Body**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (Success)**:
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "role": "user",
    "email": "testuser@hindidub.anime",
    "created_at": "2025-12-28T10:30:00.000Z"
  }
}
```

**Response (Error)**:
```json
{
  "error": "Username already exists"
}
```

**Validation Rules**:
- Username: Required, alphanumeric + underscores only
- Password: Required, minimum 6 characters
- Username uniqueness: Checked before creation

### 2. auth-login
**Endpoint**: `POST /functions/v1/auth-login`

**Request Body**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Response (Success)**:
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "role": "user",
    "email": "testuser@hindidub.anime",
    "created_at": "2025-12-28T10:30:00.000Z"
  },
  "session": {
    "token": "NTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDExOjE3MzU0NjE2MDAwMDA=",
    "expires_at": "2026-01-27T10:30:00.000Z"
  }
}
```

**Response (Error)**:
```json
{
  "error": "Invalid username or password"
}
```

### 3. auth-profile
**Endpoint**: `GET /functions/v1/auth-profile`

**Headers**:
```
Authorization: Bearer NTA3ZjFmNzdiY2Y4NmNkNzk5NDM5MDExOjE3MzU0NjE2MDAwMDA=
```

**Response (Success)**:
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "role": "user",
    "email": "testuser@hindidub.anime",
    "created_at": "2025-12-28T10:30:00.000Z",
    "avatar_url": null
  }
}
```

**Response (Error)**:
```json
{
  "error": "Unauthorized"
}
```

## Security

### Password Hashing
- **Algorithm**: SHA-256
- **Implementation**: Web Crypto API
- **Process**: 
  1. Convert password to bytes
  2. Hash with SHA-256
  3. Convert to hex string
  4. Store in MongoDB

**Note**: SHA-256 is used for simplicity. For production, use bcrypt or Argon2.

### Session Tokens
- **Format**: Base64 encoded string
- **Content**: `userId:timestamp`
- **Expiration**: 30 days
- **Storage**: localStorage

**Note**: For production, use JWT with proper signing and validation.

### CORS
- **Allowed Origins**: `*` (all origins)
- **Allowed Headers**: authorization, x-client-info, apikey, content-type
- **Preflight**: OPTIONS requests handled

## Frontend Integration

### AuthContext Changes
**Before** (Supabase Auth):
```typescript
import { supabase } from '@/db/supabase';
import type { User } from '@supabase/supabase-js';

const { data, error } = await supabase.auth.signUp({ email, password });
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
```

**After** (MongoDB via Edge Functions):
```typescript
const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-register`, {
  method: 'POST',
  body: JSON.stringify({ username, password }),
});

const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-login`, {
  method: 'POST',
  body: JSON.stringify({ username, password }),
});
```

### User Type Changes
**Before**:
```typescript
user: User | null  // Supabase User type
```

**After**:
```typescript
interface MongoUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  avatar_url?: string | null;
}

user: MongoUser | null
```

### Session Management
**Before**:
```typescript
// Supabase managed sessions automatically
supabase.auth.getSession()
supabase.auth.onAuthStateChange()
```

**After**:
```typescript
// Manual session management
localStorage.setItem('mongo_session', JSON.stringify(session));
localStorage.setItem('mongo_user', JSON.stringify(user));

const session = getStoredSession();
const user = getStoredUser();
```

## Data Storage

### What Uses MongoDB
1. ✅ User accounts (username, password, role)
2. ✅ User authentication (login, signup)
3. ✅ User sessions (token-based)

### What Uses Supabase
1. ✅ Anime data (anime_data table) - Read-only
2. ✅ Episode data (episodes_data table) - Read-only
3. ✅ Edge Functions (hosting for MongoDB API)

### What Uses localStorage
1. ✅ User sessions (mongo_session, mongo_user)
2. ✅ User profiles cache (user_profiles)
3. ✅ Favorites (anime_favorites)
4. ✅ Comments (anime_comments)
5. ✅ Watch history (anime_watch_history)

## Testing

### Test Registration
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Test Login
```bash
curl -X POST https://your-project.supabase.co/functions/v1/auth-login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Test Profile
```bash
curl -X GET https://your-project.supabase.co/functions/v1/auth-profile \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Migration from Supabase Auth

### For Existing Users
If you had users in Supabase Auth before:

1. **No automatic migration** - Users need to re-register
2. **Data loss** - Previous accounts won't work
3. **Clean start** - MongoDB starts fresh

### Steps for Users
1. Go to /register
2. Create new account with username and password
3. Log in with new credentials
4. Re-add favorites and preferences

## Troubleshooting

### Error: "Username already exists"
- **Cause**: Username is taken
- **Solution**: Choose a different username

### Error: "Invalid username or password"
- **Cause**: Wrong credentials or user doesn't exist
- **Solution**: Check credentials or register new account

### Error: "Unauthorized"
- **Cause**: Session expired or invalid token
- **Solution**: Log in again

### Error: "Internal server error"
- **Cause**: MongoDB connection issue or Edge Function error
- **Solution**: Check Edge Function logs:
  ```bash
  supabase functions logs auth-register
  supabase functions logs auth-login
  supabase functions logs auth-profile
  ```

### Session Not Persisting
- **Cause**: localStorage cleared or disabled
- **Solution**: Enable localStorage in browser settings

### Can't Access Profile
- **Cause**: Session token missing or expired
- **Solution**: Log out and log in again

## Advantages of MongoDB

### 1. Flexibility
- ✅ No schema migrations needed
- ✅ Easy to add new fields
- ✅ Document-based storage

### 2. Scalability
- ✅ Horizontal scaling
- ✅ Sharding support
- ✅ Replica sets

### 3. Performance
- ✅ Fast reads and writes
- ✅ Indexing support
- ✅ Aggregation pipeline

### 4. Cost
- ✅ Free tier available
- ✅ Pay-as-you-grow pricing
- ✅ No per-user costs

## Limitations

### 1. Security
- ⚠️ SHA-256 is not ideal for passwords (use bcrypt in production)
- ⚠️ Simple session tokens (use JWT in production)
- ⚠️ No refresh tokens

### 2. Features
- ⚠️ No email verification
- ⚠️ No password reset
- ⚠️ No OAuth providers
- ⚠️ No MFA

### 3. Session Management
- ⚠️ Sessions stored in localStorage (not secure)
- ⚠️ No server-side session validation
- ⚠️ No session revocation

## Future Enhancements

### Option 1: Improve Security
- Implement bcrypt for password hashing
- Use JWT for session tokens
- Add refresh tokens
- Implement session revocation

### Option 2: Add Features
- Email verification
- Password reset via email
- OAuth providers (Google, GitHub)
- Two-factor authentication

### Option 3: Hybrid Approach
- Keep MongoDB for user data
- Use Supabase Auth for authentication
- Best of both worlds

## Summary

### What Changed
- ✅ Switched from Supabase Auth to MongoDB
- ✅ Created 3 Edge Functions for auth operations
- ✅ Updated AuthContext to use Edge Functions
- ✅ Implemented manual session management
- ✅ Kept Supabase for anime data

### What Stayed the Same
- ✅ Anime catalog (Supabase)
- ✅ Episode data (Supabase)
- ✅ Favorites (localStorage)
- ✅ Comments (localStorage)
- ✅ Watch history (localStorage)

### Database Usage
- **MongoDB**: User authentication only
- **Supabase**: Anime data only (read-only)
- **localStorage**: User preferences and session

---

**Status**: ✅ Complete

MongoDB authentication is now fully integrated and working!
