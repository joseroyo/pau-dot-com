export function getItunesArtwork(url: string, size: number = 600): string {
  if (!url) return url;
  return url.replace(/\d+x\d+bb/, `${size}x${size}bb`);
}