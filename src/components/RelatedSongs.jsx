import SongBar from "./SongBar";

// Related Songs
const RelatedSongs = ({
  data,
  isPlaying,
  activeSong,
  artistId,
  handlePauseClick,
  handlePlayClick,
}) => (
  <div className="flex flex-col">
    {/* Head */}
    <h1 className="font-bold text-3xl text-white">Related Songs</h1>

    {/* Render each song */}
    <div className="mt-6 w-full flex flex-col">
      {data?.map((song, i) => (
        <SongBar
          key={`${song.key}-${artistId}`}
          song={song}
          i={i}
          artistId={artistId}
          isPlaying={isPlaying}
          activeSong={activeSong}
          handlePauseClick={handlePauseClick}
          handlePlayClick={handlePlayClick}
        />
      ))}
    </div>
  </div>
);

export default RelatedSongs;
