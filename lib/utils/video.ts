// lib/utils/video.ts

export function extractVideoId(url: string): {
  platform: "youtube" | "vimeo" | "unknown";
  id: string | null;
} {
  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: "youtube", id: match[1] };
    }
  }

  // Vimeo patterns
  const vimeoPatterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match) {
      return { platform: "vimeo", id: match[1] };
    }
  }

  return { platform: "unknown", id: null };
}

export function getEmbedUrl(url: string): string | null {
  const { platform, id } = extractVideoId(url);

  if (!id) return null;

  switch (platform) {
    case "youtube":
      return `https://www.youtube.com/embed/${id}`;
    case "vimeo":
      return `https://player.vimeo.com/video/${id}`;
    default:
      return null;
  }
}

export function getThumbnailUrl(url: string): string | null {
  const { platform, id } = extractVideoId(url);

  if (!id) return null;

  switch (platform) {
    case "youtube":
      return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    case "vimeo":
      // Vimeo thumbnails require API call, return placeholder
      return null;
    default:
      return null;
  }
}
