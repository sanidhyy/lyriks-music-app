import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { Error, Loader, SongCard } from "../components";
import { useGetSongsByCountryQuery } from "../redux/services/shazamCore";

// Around You
const AroundYou = () => {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data, isFetching, error } = useGetSongsByCountryQuery(country);

  // fetch country code
  useEffect(() => {
    axios
      .get("http://ip-api.com/json")
      .then((res) => setCountry(res?.data?.countryCode))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [country]);

  // loader
  if (isFetching && loading) return <Loader title="Loading songs around you" />;

  // error
  if (error && country) return <Error />;

  return (
    <div className="flex flex-col">
      {/* Head */}
      <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">
        Around You <span className="font-black">{country}</span>
      </h2>

      {/* render each song */}
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {data?.map((song, i) => (
          <SongCard
            key={song.key}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={data}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default AroundYou;
