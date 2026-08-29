import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { appleGenreIds } from "../../assets/constants";
import {
  adaptItunesArtistDetails,
  adaptItunesTrack,
  isItunesSong,
  lyricsToSections,
} from "./adaptItunesTrack";

const ITUNES = "https://itunes.apple.com";
const APPLE_RSS = "https://rss.marketingtools.apple.com/api/v2";
const LRCLIB = "https://lrclib.net/api";
const CHART_CACHE_SEC = 600;
const LRCLIB_CLIENT = "Lyriks/1.0 (https://github.com/sanidhyy/lyriks-music-app)";

const itunesError = (status, data) => ({ error: { status, data } });

const fetchJson = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    const err = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    err.data = text;
    throw err;
  }
  return res.json();
};

const idsFromItunesRss = (payload) => {
  const entries = payload?.feed?.entry;
  if (!entries) return [];
  const list = Array.isArray(entries) ? entries : [entries];
  return list
    .map((entry) => entry?.id?.attributes?.["im:id"])
    .filter(Boolean);
};

const fetchItunesRssIds = async (country, genreId, limit = 50) => {
  const cc = (country || "us").toLowerCase();
  const genrePart = genreId ? `/genre=${genreId}` : "";
  const data = await fetchJson(
    `${ITUNES}/${cc}/rss/topsongs/limit=${limit}${genrePart}/json`
  );
  return idsFromItunesRss(data);
};

const fetchMarketingRssIds = async (country, limit = 50) => {
  const cc = (country || "us").toLowerCase();
  const data = await fetchJson(
    `${APPLE_RSS}/${cc}/music/most-played/${limit}/songs.json`
  );
  return (data?.feed?.results || []).map((item) => item.id).filter(Boolean);
};

const fetchChartIds = async (country = "us") => {
  // iTunes RSS sends CORS; marketing-tools RSS does not, so it cannot
  // be called from the browser. Keep it as a non-browser fallback only.
  try {
    const ids = await fetchItunesRssIds(country);
    if (ids.length) return ids;
  } catch {
    // missing storefront
  }
  try {
    return await fetchMarketingRssIds(country);
  } catch {
    return [];
  }
};

const lookupTracksByIds = async (ids) => {
  const unique = [...new Set((ids || []).filter(Boolean))].slice(0, 50);
  if (!unique.length) return [];
  const data = await fetchJson(`${ITUNES}/lookup?id=${unique.join(",")}`);
  return (data.results || []).filter(isItunesSong).map(adaptItunesTrack);
};

const getChartSongs = async (country = "us") => {
  let songs = await lookupTracksByIds(await fetchChartIds(country));
  if (!songs.length && country.toLowerCase() !== "us") {
    songs = await lookupTracksByIds(await fetchChartIds("us"));
  }
  return songs;
};

const fetchLyrics = async (title, artist, durationSec) => {
  if (!title || !artist) return null;

  const params = new URLSearchParams({
    track_name: title,
    artist_name: artist,
  });
  if (durationSec) params.set("duration", String(durationSec));

  try {
    const res = await fetch(`${LRCLIB}/get?${params}`, {
      headers: { "Lrclib-Client": LRCLIB_CLIENT },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    return data.plainLyrics || null;
  } catch {
    return null;
  }
};

export const musicApi = createApi({
  reducerPath: "musicApi",
  baseQuery: fetchBaseQuery({ baseUrl: ITUNES }),
  keepUnusedDataFor: CHART_CACHE_SEC,
  endpoints: (builder) => ({
    getTopCharts: builder.query({
      queryFn: async () => {
        try {
          return { data: await getChartSongs("us") };
        } catch (err) {
          return itunesError(err.status || 500, err.data || err.message);
        }
      },
    }),
    getSongsByGenre: builder.query({
      queryFn: async (genre) => {
        try {
          const genreId = appleGenreIds[genre] || appleGenreIds.POP;
          const ids = await fetchItunesRssIds("us", genreId);
          return { data: await lookupTracksByIds(ids) };
        } catch (err) {
          return itunesError(err.status || 500, err.data || err.message);
        }
      },
    }),
    getSongsByCountry: builder.query({
      queryFn: async (countryCode) => {
        try {
          return { data: await getChartSongs(countryCode) };
        } catch (err) {
          return itunesError(err.status || 500, err.data || err.message);
        }
      },
    }),
    getSongsBySearch: builder.query({
      queryFn: async (searchTerm) => {
        try {
          const term = encodeURIComponent(searchTerm || "");
          const data = await fetchJson(
            `${ITUNES}/search?term=${term}&entity=song&limit=25`
          );
          return {
            data: (data.results || []).filter(isItunesSong).map(adaptItunesTrack),
          };
        } catch (err) {
          return itunesError(err.status || 500, err.data || err.message);
        }
      },
    }),
    getSongDetails: builder.query({
      keepUnusedDataFor: 60,
      queryFn: async ({ songid }) => {
        try {
          const data = await fetchJson(`${ITUNES}/lookup?id=${songid}`);
          const track = (data.results || []).find(isItunesSong);
          if (!track) return itunesError(404, "Track not found");

          const song = adaptItunesTrack(track);
          const plainLyrics = await fetchLyrics(
            song.title,
            song.subtitle,
            song.durationSec
          );
          song.sections = lyricsToSections(plainLyrics);
          return { data: song };
        } catch (err) {
          return itunesError(err.status || 500, err.data || err.message);
        }
      },
    }),
    getSongRelated: builder.query({
      keepUnusedDataFor: 60,
      queryFn: async (artistId) => {
        try {
          if (!artistId) return { data: [] };
          const data = await fetchJson(
            `${ITUNES}/lookup?id=${artistId}&entity=song&limit=20`
          );
          return {
            data: (data.results || []).filter(isItunesSong).map(adaptItunesTrack),
          };
        } catch (err) {
          return itunesError(err.status || 500, err.data || err.message);
        }
      },
    }),
    getArtistDetails: builder.query({
      keepUnusedDataFor: 60,
      queryFn: async (artistId) => {
        try {
          const data = await fetchJson(
            `${ITUNES}/lookup?id=${artistId}&entity=song&limit=20`
          );
          if (!data.results?.length) return itunesError(404, "Artist not found");
          return { data: adaptItunesArtistDetails(data.results, artistId) };
        } catch (err) {
          return itunesError(err.status || 500, err.data || err.message);
        }
      },
    }),
  }),
});

export const {
  useGetTopChartsQuery,
  useGetSongsByGenreQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetArtistDetailsQuery,
  useGetSongsByCountryQuery,
  useGetSongsBySearchQuery,
} = musicApi;
