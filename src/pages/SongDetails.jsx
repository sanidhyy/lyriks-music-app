import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";
import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
} from "../redux/services/musicApi";

// Song Details
const SongDetails = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { songid } = useParams();
  const {
    data: songData,
    isFetching: isFetchingSongDetails,
    error: songError,
  } = useGetSongDetailsQuery({ songid });
  const artistId = songData?.artists?.[0]?.adamid;
  const {
    data,
    isFetching: isFetchingRelatedSongs,
    error,
  } = useGetSongRelatedQuery(artistId, { skip: !artistId });

  // handle pause click
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  // handle play click
  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  // loader
  if (isFetchingSongDetails || isFetchingRelatedSongs)
    return <Loader title="Searching song details" />;

  // error
  if (songError || error) return <Error />;

  return (
    <div className="flex flex-col">
      {/* Details Header */}
      <DetailsHeader artistId="" songData={songData} />

      {/* Lyrics */}
      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>

        {/* Lines */}
        <div className="mt-5">
          {songData?.sections?.[1]?.type === "LYRICS" ? (
            songData.sections[1].text.map((line, i) => (
              <p className="text-gray-400 text-base my-1" key={`Line-${i}`}>
                {line}
              </p>
            ))
          ) : (
            // No lyrics found
            <p className="text-gray-400 text-base my-1">
              Sorry, no lyrics found!
            </p>
          )}
        </div>

        {songData?.trackViewUrl && (
          <a
            href={songData.trackViewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-4 text-sm text-[#c4b5fd] underline"
          >
            Listen on Apple Music
          </a>
        )}
      </div>

      {/* Related songs */}
      <RelatedSongs
        data={data}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;
