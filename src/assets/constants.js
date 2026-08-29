/**
 * Add new constants in this file.
 * Don't remove anything from here, if not sure
 */

import {
  HiOutlineHashtag,
  HiOutlineHome,
  HiOutlinePhotograph,
  HiOutlineUserGroup,
} from "react-icons/hi";

// Song Genres
export const genres = [
  { title: "Pop", value: "POP" },
  { title: "Hip-Hop", value: "HIP_HOP_RAP" },
  { title: "Dance", value: "DANCE" },
  { title: "Electronic", value: "ELECTRONIC" },
  { title: "Soul", value: "SOUL_RNB" },
  { title: "Alternative", value: "ALTERNATIVE" },
  { title: "Rock", value: "ROCK" },
  { title: "Latin", value: "LATIN" },
  { title: "Film", value: "FILM_TV" },
  { title: "Country", value: "COUNTRY" },
  { title: "Worldwide", value: "WORLDWIDE" },
  { title: "Reggae", value: "REGGAE_DANCE_HALL" },
  { title: "House", value: "HOUSE" },
  { title: "K-Pop", value: "K_POP" },
];

// Apple iTunes RSS genre ids for Discover charts
export const appleGenreIds = {
  POP: 14,
  HIP_HOP_RAP: 18,
  DANCE: 17,
  ELECTRONIC: 7,
  SOUL_RNB: 15,
  ALTERNATIVE: 20,
  ROCK: 21,
  LATIN: 12,
  FILM_TV: 16,
  COUNTRY: 6,
  WORLDWIDE: 19,
  REGGAE_DANCE_HALL: 24,
  HOUSE: 17,
  K_POP: 51,
};

// Navbar Links
export const links = [
  { name: "Discover", to: "/", icon: HiOutlineHome },
  { name: "Around You", to: "/around-you", icon: HiOutlinePhotograph },
  { name: "Top Artists", to: "/top-artists", icon: HiOutlineUserGroup },
  { name: "Top Charts", to: "/top-charts", icon: HiOutlineHashtag },
];
