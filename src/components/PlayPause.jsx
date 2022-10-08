import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

// Play Pause
const PlayPause = ({ isPlaying, activeSong, song, handlePlay, handlePause }) =>
  isPlaying && activeSong?.title === song.title ? (
    // Pause Icon
    <FaPauseCircle size={35} className="text-gray-300" onClick={handlePause} />
  ) : (
    // Play Icon
    <FaPlayCircle size={35} className="text-gray-300" onClick={handlePlay} />
  );

export default PlayPause;
