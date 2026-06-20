import type { Episode } from "@/data/episodes";

type Variant = "compact" | "full";

/**
 * Reproductor de Spotify embebido para episodios o show.
 * Pasa `episodeId` para un episodio, o `showId` para el show completo.
 */
export function SpotifyPlayer({
  episodeId,
  showId,
  variant = "compact",
  title = "Reproductor de Spotify",
}: {
  episodeId?: string;
  showId?: string;
  variant?: Variant;
  title?: string;
}) {
  const path = episodeId ? `episode/${episodeId}` : showId ? `show/${showId}` : null;
  if (!path) return null;

  const src = `https://open.spotify.com/embed/${path}?utm_source=generator&theme=0`;
  const height = variant === "full" ? 352 : 152;

  return (
    <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-soft">
      <iframe
        title={title}
        src={src}
        width="100%"
        height={height}
        frameBorder={0}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="block"
      />
    </div>
  );
}

export function EpisodeSpotifyPlayer({
  episode,
  variant = "compact",
}: { episode: Episode; variant?: Variant }) {
  return (
    <SpotifyPlayer
      episodeId={episode.spotifyEpisodeId}
      variant={variant}
      title={`Reproductor Spotify · ${episode.title}`}
    />
  );
}
