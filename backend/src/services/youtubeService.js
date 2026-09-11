/**
 * youtubeService.js
 * Fetches public video metadata (title, thumbnail, duration, channel)
 * using the YouTube Data API v3.
 *
 * If YOUTUBE_API_KEY is not configured, returns a graceful fallback so the
 * rest of the verification flow still works.
 */

// --------------------------------------------------------------------------
// Helper — extract YouTube video ID from any standard YouTube URL format
// --------------------------------------------------------------------------
export const extractVideoId = (url) => {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    // youtu.be/<id>
    if (hostname === "youtu.be") {
      return parsed.pathname.slice(1).split("?")[0] || null;
    }

    // youtube.com/watch?v=<id>
    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v) return v;

      // youtube.com/embed/<id>  or  youtube.com/shorts/<id>
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "v"].includes(segments[0]) && segments[1]) {
        return segments[1];
      }
    }

    return null;
  } catch {
    return null;
  }
};

// --------------------------------------------------------------------------
// Helper — convert ISO 8601 duration (PT1H2M3S) → human-readable "1h 2m 3s"
// --------------------------------------------------------------------------
const parseDuration = (iso) => {
  if (!iso) return "Unknown";
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}h ` : "";
  const m = match[2] ? `${match[2]}m ` : "";
  const s = match[3] ? `${match[3]}s` : "";
  return `${h}${m}${s}`.trim() || "0s";
};

// --------------------------------------------------------------------------
// Main export — fetch YouTube video metadata
// --------------------------------------------------------------------------
export const getVideoMetadata = async (videoUrl) => {
  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    throw new Error("Could not extract a valid YouTube video ID from the URL.");
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  // ── Fallback: no API key configured ──────────────────────────────────────
  if (!apiKey || apiKey === "YOUR_YOUTUBE_DATA_API_V3_KEY_HERE") {
    return {
      videoId,
      title: "Video title unavailable (YouTube API key not configured)",
      thumbnail:
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: "Unknown",
      channelTitle: "Unknown Channel",
      viewCount: null,
      publishedAt: null,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      apiKeyMissing: true,
    };
  }

  // ── Fetch from YouTube Data API v3 ────────────────────────────────────────
  const apiUrl =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet,contentDetails,statistics` +
    `&id=${encodeURIComponent(videoId)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const msg =
      body?.error?.message || `YouTube API responded with HTTP ${response.status}`;
    throw new Error(`YouTube API error: ${msg}`);
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(
      "No video found for the given URL. The video may be private, unlisted, or deleted."
    );
  }

  const item = data.items[0];
  const snippet = item.snippet || {};
  const contentDetails = item.contentDetails || {};
  const statistics = item.statistics || {};

  const thumbnail =
    snippet.thumbnails?.maxres?.url ||
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return {
    videoId,
    title: snippet.title || "Untitled Video",
    thumbnail,
    duration: parseDuration(contentDetails.duration),
    channelTitle: snippet.channelTitle || "Unknown Channel",
    viewCount: statistics.viewCount ? Number(statistics.viewCount) : null,
    publishedAt: snippet.publishedAt || null,
    description: snippet.description || "",
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    apiKeyMissing: false,
  };
};
