import { MediaSearchResult } from "./types";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function buildImageUrl(posterPath: string | null): string {
  return posterPath ? `${IMAGE_BASE}${posterPath}` : "";
}

export async function searchMoviesTmdb(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();

  return (data.results || []).slice(0, 4).map((item: any) => ({
    id: String(item.id),
    title: item.title,
    artist: item.release_date ? item.release_date.slice(0, 4) : undefined,
    imageUrl: buildImageUrl(item.poster_path),
  }));
}

export async function searchSeriesTmdb(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();

  return (data.results || []).slice(0, 4).map((item: any) => ({
    id: String(item.id),
    title: item.name,
    artist: item.first_air_date ? item.first_air_date.slice(0, 4) : undefined,
    imageUrl: buildImageUrl(item.poster_path),
  }));
}