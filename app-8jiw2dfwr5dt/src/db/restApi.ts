// Direct Supabase REST API implementation
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Direct REST API call to Supabase
 * @param path - The REST API path (e.g., "anime_data?id=eq.123")
 * @param options - Additional fetch options
 */
export async function api<T = any>(path: string, options?: RequestInit): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Save watch progress to localStorage
 */
export function saveWatch(animeId: string, season: number, episode: number): void {
  localStorage.setItem(
    `watch-${animeId}`,
    JSON.stringify({ season, episode })
  );
}

/**
 * Get watch progress from localStorage
 */
export function getWatch(animeId: string): { season: number; episode: number } | null {
  const data = localStorage.getItem(`watch-${animeId}`);
  return data ? JSON.parse(data) : null;
}

/**
 * Save favorites to localStorage
 */
export function saveFavorite(animeId: string): void {
  const favorites = getFavorites();
  if (!favorites.includes(animeId)) {
    favorites.push(animeId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

/**
 * Remove favorite from localStorage
 */
export function removeFavorite(animeId: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter(id => id !== animeId);
  localStorage.setItem('favorites', JSON.stringify(filtered));
}

/**
 * Get all favorites from localStorage
 */
export function getFavorites(): string[] {
  const data = localStorage.getItem('favorites');
  return data ? JSON.parse(data) : [];
}

/**
 * Check if anime is favorited
 */
export function isFavorited(animeId: string): boolean {
  return getFavorites().includes(animeId);
}
