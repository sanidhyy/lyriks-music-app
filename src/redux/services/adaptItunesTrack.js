/**
 * Normalize iTunes Search / lookup tracks into the Shazam-like shape the UI reads.
 */

export const scaleArtwork = (url, size = 400) => {
  if (!url) return "";
  return url.replace(/\/\d+x\d+bb/, `/${size}x${size}bb`);
};

export const isItunesSong = (result) =>
  Boolean(
    result?.trackId && (result.kind === "song" || result.wrapperType === "track")
  );

export const adaptItunesTrack = (track) => {
  if (!track) return null;

  const artwork = track.artworkUrl100 || "";
  const coverart = scaleArtwork(artwork, 400);
  const title = track.trackName || "";
  const artistName = track.artistName || "";

  return {
    key: String(track.trackId),
    title,
    subtitle: artistName,
    artists: [{ adamid: String(track.artistId || "") }],
    images: {
      coverart,
      background: scaleArtwork(artwork, 800),
    },
    hub: {
      actions: [{}, { uri: track.previewUrl || "" }],
    },
    genres: {
      primary: track.primaryGenreName || "",
    },
    durationSec: Math.floor((track.trackTimeMillis || 0) / 1000),
    trackViewUrl: track.trackViewUrl || "",
    attributes: {
      name: title,
      albumName: track.collectionName || "",
      artwork: { url: scaleArtwork(artwork, 125) },
    },
  };
};

export const adaptItunesArtistDetails = (results, artistId) => {
  const list = results || [];
  const artist =
    list.find((item) => item.wrapperType === "artist") || list[0] || {};
  const songs = list.filter(isItunesSong).map(adaptItunesTrack).filter(Boolean);

  const songsMap = {};
  songs.forEach((song) => {
    songsMap[song.key] = song;
  });

  const artwork =
    artist.artworkUrl100 ||
    artist.artworkUrl60 ||
    songs[0]?.images?.coverart ||
    "";

  return {
    artists: {
      [artistId]: {
        attributes: {
          name: artist.artistName || songs[0]?.subtitle || "",
          artwork: { url: scaleArtwork(artwork, 500) },
          genreNames: [
            artist.primaryGenreName || songs[0]?.genres?.primary || "",
          ],
        },
      },
    },
    songs: songsMap,
  };
};

export const lyricsToSections = (plainLyrics) => {
  if (!plainLyrics) {
    return [{ type: "OTHER" }, { type: "OTHER" }];
  }

  return [
    { type: "OTHER" },
    { type: "LYRICS", text: plainLyrics.split("\n") },
  ];
};
