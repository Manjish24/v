/**
 * YouTube Utility functions for Capacity Connect
 * Robustly parses YouTube URLs to extract video ID and validates URLs
 */

export function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;

  // Patterns covering:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/v/VIDEO_ID
  // - https://m.youtube.com/watch?v=VIDEO_ID
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);

  return match && match[1].length === 11 ? match[1] : null;
}

export function getYouTubeEmbedUrl(videoId) {
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

export function isValidYouTubeUrl(url) {
  return extractYouTubeVideoId(url) !== null;
}
